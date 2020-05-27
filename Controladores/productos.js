var cn = require('./conexion');
var express = require('express')
const bodyp =require('body-parser');
const valores = require('../constantes');
const jwt=require('jsonwebtoken');
const sqlGral = require('../AdministradorSQL/AdministradorGral.js');
const sqlProductos = require('../AdministradorSQL/sql_productos');

var router = express.Router()
router.use(bodyp.json());


router.get('/',  async function (req, res) {
    try {
        cn.query(sqlProductos.SQL_listaProductosLIBRE(),
        { type : cn.QueryTypes.SELECT}).then( function (resultado) {
            res.status(200);
            res.json(resultado);
        }); 
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar listar productos"});
    }
});

router.post('/', verificarToken, verificarValoresInsert,  async function (req, res) {
    try {
        const { descripcion, precio, url_imagen, stock} = req.body;
        if (res.locals.rol == "1") {
            let id = await RealizarINSERT(descripcion, precio, url_imagen, stock);
            if (id != 0) {
                res.status(201);
                res.json("ok");
            } else {
                res.status(400);
                res.json({ codigo: '400', mensaje : "error inesperado al crear usuario, verifique los datos"});
            }
        } else {
            res.status(403);
            res.json({ codigo: '403', mensaje : "Solo los administradores tiene acceso a esta opcion"});
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar insertar productos, verifique los valores"});
    }
});

router.get('/usuario/:idusuario', verificarToken, verificarUsuario, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.idusuario))) {
            cn.query(sqlProductos.SQL_listaProductosPORID(res.locals.id),
            { type : cn.QueryTypes.SELECT}).then( function (resultado) {
                res.status(200);
                res.json(resultado);
            }); 
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar listar productos"});
    }
});

router.get('/:id', async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            var resultado = await RealizarConsultaPorID(req.params.id);
            res.status(200);
            res.json(resultado);
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
        }    
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error insperado al consultar, verifique datos"});
    }
});

router.put('/:id', verificarToken, verificarDatosUpdateProd, verificarAdmin, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            const { descripcion, precio, url_imagen, stock} = req.body;
            var resultado = await RealizarUpdateProd(req.params.id, descripcion, precio, url_imagen, stock)
            if (resultado) {
                res.status(201);
                res.json('ok');
            } else {
                res.status(400);
                res.json({ codigo: '400', mensaje : "no pudo realizarse la operacion"});
            };
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
        }    
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error insperado al consultar, verifique datos"});
    }
});

router.delete('/:id', verificarToken, verificarAdmin, async function (req, res) {
    if (!isNaN(parseInt(req.params.id))) {
        let resultado = await RealizarDELETE(req.params.id);
        if (resultado == "x") {
            res.status(403);
            res.json({ codigo: '403', mensaje : "No se puede eliminar el producto dado que tiene pedidos pendientes o sin cancelar"});
        } else if (resultado == 0){
            res.status(400);
            res.json({ codigo: '400', mensaje : "error insperado al eliminar, verifique datos"});
        } else {
            res.status(201);
            res.json('ok');  
        };
    } else {
        res.status(404);
        res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
    }
});

router.post('/favoritos/:id', verificarToken, VerificarFavorito, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            var resultado = await AgregarFavorito(req.params.id, res.locals.id)
            if (resultado.length) {
                res.status(201);
                res.json('ok');    
            } else {
                res.status(400);
                res.json({ codigo: '404', mensaje : "No se pudo realizar la operacion"});
            }
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
        }    
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error insperado al consultar, verifique datos"});
    }
});

router.delete('/favoritos/:id', verificarToken, VerificarFavoritoDelete, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            var resultado = await EliminarFavorito(req.params.id, res.locals.id)
            if (resultado.length) {
                res.status(201);
                res.json('ok');    
            } else {
                res.status(400);
                res.json({ codigo: '404', mensaje : "No se pudo realizar la operacion"});
            }
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "Url invalida o ya no existe"});
        }    
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error insperado al consultar, verifique datos"});
    }
});

//  FUNCIONES //////////////////////////////////////////////////////////////

function verificarValoresInsert(req, res, next) {
    const { descripcion, precio, url_imagen, stock} = req.body;
    if (!descripcion || !precio || !stock) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "faltan datos para el alta de su registro, verifique"});
    } else {
        next();
    }  
};

async function RealizarINSERT(des, pre, url, stock) {
    let ssql = sqlProductos.SQL_INSERT(des, pre, url, stock);
    let resultado = await cn.query(ssql);
    if (resultado.length) {
        return resultado[0];
    } else {
        return 0;
    };
};

async function RealizarConsultaPorID(id) {
    var sql = sqlProductos.SQL_CONSULTAPORID(id);
    var respuesta = await cn.query(sql, { type : cn.QueryTypes.SELECT});
    return respuesta;
};

async function RealizarUpdateProd(id, des, pre, url, stock) {
    var ssql = sqlProductos.SQL_UPDATEPROD(id,des, pre, url, stock);
    var resultado = await cn.query(ssql);
    return resultado[0].affectedRows > 0;
};

async function RealizarDELETE(id) {
    try {
        let ssql1 = sqlProductos.SQL_PuedeEliminar(id);
        let noPuedeEliminar = await cn.query(ssql1, { type : cn.QueryTypes.SELECT});
        if (noPuedeEliminar[0].id != null) {
            return "x";
        } else {
            var ssql = sqlProductos.SQL_DELETEPROD(id);
            var resultado = await cn.query(ssql);
            return resultado[0].affectedRows > 0; 
        }
    } catch (error) {
        return 0;
    }
};

async function AgregarFavorito(idprod, idusu) {
    try {
        var ssql = sqlProductos.sql_AgregarFavorito(idprod, idusu);
        var resultado = await cn.query(ssql);
        return resultado;
    } catch (error) {
        return 0;
    }  
};

async function EliminarFavorito(idprod, idusu) {
    try {
        var ssql = sqlProductos.sql_EliminarFavorito(idprod, idusu);
        var resultado = await cn.query(ssql);
        return resultado;
    } catch (error) {
        return 0;
    }  
};

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

function verificarUsuario(req, res, next) {
    if (req.params.idusuario != res.locals.id) {
        res.status(403);
        res.json({codigo: '403', error : "usuario invalido para este token"});
    } else {
        next();
    }
};

function verificarDatosUpdateProd(req, res, next) {
    const { descripcion, precio, url_imagen, stock} = req.body;
    console.log(stock);
    if (!descripcion || !precio) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "faltan datos para el alta de su actualizacion, verifique"});
    } else {
        next();
    }  
};

function verificarAdmin(req, res, next) {
    if (res.locals.rol == "1") {
        next();
    } else {
        res.status(400);
        res.json({ codigo: '400', mensaje : "usuario invalido para esta operacion"});
    };
};

async function VerificarFavorito(req, res, next) {
    try {
        let ssql1 = sqlProductos.sql_TieneFavorito(req.params.id, res.locals.id);
        let favorito = await cn.query(ssql1, { type : cn.QueryTypes.SELECT});
        if (favorito.length) {
            res.status(201)
            res.json("ya esta");
        } else {
            next();
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error inesperado con el producto"});
    }
};

async function VerificarFavoritoDelete(req, res, next) {
    try {
        let ssql1 = sqlProductos.sql_TieneFavorito(req.params.id, res.locals.id);
        let favorito = await cn.query(ssql1, { type : cn.QueryTypes.SELECT});
        if (favorito.length) {
            next();
        } else {
            res.status(201);
            res.json("ya esta");
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error inesperado con el producto"});
    }
};

// FIN FUNCIONES  /////////////////////////////////////////////////////////

module.exports = router 