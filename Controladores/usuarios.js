var cn = require('./conexion');
var express = require('express')
const bodyp =require('body-parser');
const valores = require('../constantes');
const jwt=require('jsonwebtoken');
const sqlGral = require('../AdministradorSQL/AdministradorGral.js');
const sqlUsuarios = require('../AdministradorSQL/sql_usuarios');

var router = express.Router()
router.use(bodyp.json());

router.get('/',verificarToken,  async function (req, res) {
    if (res.locals.rol == "1") {
        cn.query(sqlUsuarios.SQL_listaUsuarios() ,
        { type : cn.QueryTypes.SELECT}).then( function (resultado) {
            res.status(200);
            res.json(resultado);
        });
    } else {
        res.status(403);
        res.json({ codigo: '403', mensaje : "Solo usuarios tipo administrador pueden realizar esta accion"});
    }
});

router.post('/', VerificarDatosCreacion, async function (req, res) {
    const {usuario, nombre, domicilio, email, password, telefono} = req.body;
    let valido = await ValidarUsuarioEmail(usuario, email);
    if (!valido) {
        let id = await RealizarInsert(usuario, nombre, domicilio, email, password, telefono);
        if (id != 0) {
            let valenca = getRandomInt(001,999);
            let valpie = getRandomInt(01,99);
            let stoken=jwt.sign(valenca+'|'+id+'|'+usuario+'|2|'+valpie, valores.firma);
            res.status(200);
            res.json({ id: id, token : stoken, rol: 2, nombre: nombre });
        } else {
            res.status(400);
            res.json({ codigo: '400', mensaje : "error inesperado al crear usuario, verifique los datos"});
        }
    } else {
        res.status(400);
        res.json({ codigo: '400', mensaje : "Usuario y/o mail no estan disponible intente con otro"});
    };
});

router.get('/:id', verificarToken, async function (req, res) {
    if (!isNaN(parseInt(req.params.id))) {
        let resultado = await ConsultarDatosUsuario(req.params.id, res.locals.user, res.locals.rol == "1");
        if (resultado.length) {
            res.status(200);
            res.json(resultado);
        } else {
            res.status(400);
            res.json({ codigo: '400', mensaje : "usuario invalido para esta consulta"});
        };
    } else {
        res.status(404);
        res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
    };
});

router.put('/:id', verificarToken, VerificarDatosUpdate, async function (req, res) {
    if (!isNaN(parseInt(req.params.id))) {
        const { rol, nombre, domicilio, bloqueado, password, telefono} = req.body;
        let resultado = await RalizarUPDATE(req.params.id, res.locals.user, rol,  nombre, domicilio, bloqueado, password, telefono, res.locals.rol == "1");
        if (resultado) {
            res.status(201);
            res.json('ok');
        } else {
            res.status(400);
            res.json({ codigo: '400', mensaje : "usuario invalido para esta consulta"});
        };
    } else {
        res.status(404);
        res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
    };
});

router.delete('/:id', verificarToken, async function (req, res) {
    if (!isNaN(parseInt(req.params.id))) {
        let resultado = await RealizarDELETE(req.params.id, res.locals.user, res.locals.rol == "1");
        if (resultado == "x") {
            res.status(400);
            res.json({ codigo: '400', mensaje : "No puede eliminar el usuario dado que teine pedidos sin finalizar o cancelar"});
        } else if (resultado) {
            res.status(201);
            res.json('ok');
        } else {
            res.status(400);
            res.json({ codigo: '400', mensaje : "usuario invalido para esta consulta"});
        };
    } else {
        res.status(404);
        res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
    };
});

//  FUNCIONES //////////////////////////////////////////////////////////////

async function ValidarUsuarioEmail(usuario, email) {
    let ssql = sqlUsuarios.SQL_VerificarDisponibilidad(usuario, email)
    let resultado = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
    return resultado.length;

};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

async function RealizarInsert(usu, nom, dom, mail, pass, tel) {
    let ssql = sqlUsuarios.SQL_INSERT(usu, nom, dom, mail, pass, tel);
    let resultado = await cn.query(ssql);
    if (resultado.length) {
        return resultado[0];
    } else {
        return 0;
    };
};

async function ConsultarDatosUsuario(id, usu, esAdmin) {
    try {
        let ssql2 = sqlUsuarios.SQL_SELECTUSUARIO(id, usu, esAdmin);
        let resultado = await cn.query(ssql2, { type : cn.QueryTypes.SELECT});
        return resultado;    
    } catch (error) {
        return [];
    }
};

async function RalizarUPDATE(id, usu, rol, nom, dom, bloq, pass, tel, esAdmin) {
    try {
        let ssql2 = sqlUsuarios.SQL_UPDATEUSUARIO(id, usu, rol, nom, dom, bloq, pass, tel, esAdmin);
        let resultado = await cn.query(ssql2);
        return resultado[0].affectedRows > 0;    
    } catch (error) {
        return [];
    }
};

async function RealizarDELETE(id, usu, esAdmin) {
    try {
        let ssql = sqlUsuarios.SQL_PUEDEELIMINAR(id);
        let puedeElimitar = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
        if (!puedeElimitar.length) {
            let ssql2 = sqlUsuarios.SQLDELETEUSUARIO(id, usu, esAdmin);
            let resultado = await cn.query(ssql2);
            return resultado[0].affectedRows > 0;    
        } else {
            return "x";
        };
    } catch (error) {
        return [];
    }
};

// ************************   MIDDLEWARE   *********************************

function verificarToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let user = jwt.verify(token, valores.firma);
        res.locals.id = user.split("|")[1];
        res.locals.user = user.split("|")[2];
        res.locals.rol =user.split("|")[3];
        next();
    } catch (error) {
        res.status(403);
        res.json({codigo: '403', error : "token invalido"});
    }
};

function VerificarDatosCreacion(req, res, next) {
    const {usuario, nombre, domicilio, email, password, telefono} = req.body;
    if (!usuario || !nombre || !domicilio || !email || !password || !telefono) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "faltan datos para el alta de su registro, verifique"});
    } else {  
        next();
    }
};

function VerificarDatosUpdate(req, res, next) {
    const { rol, nombre, domicilio, bloqueado, password, telefono} = req.body;
    if (!rol || !nombre || !domicilio || !password || !telefono) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "faltan datos para el alta de su registro, verifique"});
    } else {
        next();
    }
};

// FIN FUNCIONES  /////////////////////////////////////////////////////////

module.exports = router 