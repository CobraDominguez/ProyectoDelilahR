var cn = require('./conexion');
var express = require('express')
const bodyp =require('body-parser');
const valores = require('../constantes');
const jwt=require('jsonwebtoken');
const sqlPedidos = require('../AdministradorSQL/sql_pedidos.js');

var router = express.Router()
router.use(bodyp.json());

router.get('/', verificarToken, async function (req, res) {
    try {
        let resultado = await RealizarConsulta(res.locals.rol, res.locals.id);
        res.status(200);
        res.json(resultado);
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar listar productos"});
    }
});

router.post('/', verificarToken, verificarDatosinsertCarrito, verificarCarritoUnico, async function (req, res) {
    try {
        const { idpedido, idproducto, cantidad} = req.body;
        let resultado = await AgregaraCarrito(res.locals.id, idpedido, idproducto, cantidad);
        res.status(200);
        res.json(resultado);
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar listar productos"});
    }
});

router.put('/', verificarToken, verificarDatosupdateCarrito, async function (req, res) {
    try {
        const { idpedido, idestado, idpago} = req.body;
        let resultado = await CambiarEstadoPedido(idpedido, idestado, idpago, res.locals.rol, res.locals.id);
        if (resultado == "x") {
            res.status(403);
            res.json({ codigo: '403', mensaje : "No tien permisos para realizar esta operacion"});
        } else {
            res.status(201);
            res.json("ok");
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar cambiar estado de pedido"});
    }
});

router.get('/:id', verificarToken, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            let resultado = await RealizarConsultaPorID(res.locals.rol, res.locals.id, req.params.id);
            res.status(200);
            res.json(resultado);
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "no es una ruta valida"});
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar obtener pedido"});
    }
});

router.delete('/:id', verificarToken, validarPertenecniaPedido, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            let resultado = await RealizarEliminacionPorID(res.locals.rol, req.params.id);
            if (resultado.length) {
                res.status(201);
                res.json("ok");    
            } else {
                res.status(400);
                res.json({ codigo: '400', mensaje : "no puede cancelar su pedido ya esta listo, hable con el administrador"});
            }            
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "no es una ruta valida"});
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar obtener pedido"});
    }
});

router.delete('/carrito/:id', verificarToken, validarPertenecniaPedido, validarDatosDeleteCarrito, async function (req, res) {
    try {
        if (!isNaN(parseInt(req.params.id))) {
            const { idproducto, vaciar } = req.body;
            let resultado = await RealizarEliminacionPorCarritoID(idproducto, vaciar, req.params.id);
            if (resultado.length) {
                res.status(201);
                res.json("ok");    
            } else {
                res.status(400);
                res.json({ codigo: '400', mensaje : "no pudo completar la operacion, verifique que los datos pertenezcan al carrito"});
            }            
        } else {
            res.status(404);
            res.json({ codigo: '404', mensaje : "no es una ruta valida"});
        }
    } catch (error) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "error al intentar obtener pedido"});
    }
});


//  FUNCIONES //////////////////////////////////////////////////////////////


async function RealizarConsulta(rol, idusu) {
    let ssql = sqlPedidos.sql_ListadoPedidos(rol, idusu);
    var respuesta = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
    return respuesta;
};

async function RealizarConsultaPorID(rol, idusu, id) {
    let ssql = sqlPedidos.sql_ConsultaPedidoporID(rol,idusu, id)  ;
    var respuesta = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
    if (respuesta.length) {
        var lista = [];
        let ssql1 = sqlPedidos.sql_DetallePedidoPorID(respuesta[0].id);
        var detalle = await cn.query(ssql1, { type : cn.QueryTypes.SELECT});
        respuesta[0].detalle = detalle;
        return respuesta;
    } else {
        return respuesta;
    }
};

async function RealizarEliminacionPorID(rol, id) {
    let ssql = sqlPedidos.sql_cancelarPedido(id, rol);
    var respuesta = await cn.query(ssql);
    return respuesta;
};

async function AgregaraCarrito(idusu, idpedido, idprod, cantidad) {
    if (idpedido == 0) {
        let ssql = sqlPedidos.sql_armarpedidocarrito(idusu);
        var pedido = await cn.query(ssql);
        idpedido = pedido[0];
    };
    let ssql1 = sqlPedidos.sql_armarinsertCarrito(idpedido, idprod, cantidad);
    var detalle = await cn.query(ssql1);
    return idpedido;
};

async function CambiarEstadoPedido(idped, idestado, idpago, rol, idusu) {
    if (idestado > 2 && rol != "1") {
        return "x";
    } else {
        if (idestado == 2) {
            let ssql = sqlPedidos.sql_obtenertotalyfecha(idped, idusu);
            var datos = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
            if (datos.length) {
                let ssql1 = sqlPedidos.sql_confirmarpedidousuario(datos[0].total,idped, idpago);
                var respuesta = await cn.query(ssql1);
                return "z";
            } else {
                return "x";
            }
        } else {
            if (rol != "1") {
                return "x";
            } else {
                let ssql2 = sqlPedidos.sql_cambiarEstadoPedido(idestado, idped);
                var respuesta2 = await cn.query(ssql2);
                return "z";
            };
        };
    };
};

async function RealizarEliminacionPorCarritoID(idprod, vaciar, idped) {
      try {
        if (vaciar == true) {
            let ssql = sqlPedidos.sql_vaciarcarritoDetalle(idped);
            var respuesta = await cn.query(ssql);
        } else {
            let ssql1 = sqlPedidos.sql_EliminarProductocarrito(idprod, idped);
            var respuesta = await cn.query(ssql1);
        }
        return respuesta;
      } catch (error) {
          
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

async function verificarDatosinsertCarrito(req, res, next) {
    const { idpedido, idproducto, cantidad} = req.body;
    if (idpedido == undefined || !idproducto || !cantidad) {
        res.status(400);
        res.json({codigo: '400', error : "Faltan valores, por favor verifique"});
    } else {
        next();
    };
};

async function verificarCarritoUnico(req, res, next) {
    const { idpedido } = req.body;
    if (idpedido == 0) {
        let ssql = sqlPedidos.sql_haycarritoencurso(res.locals.id);
        var carrito = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
        if (carrito.length) {
            res.status(400);
            res.json({codigo: '400', error : "Tiene un carrito sin confirmar"});
        } else {
            next();
        }
    } else {
        next();
    }
};

function verificarDatosupdateCarrito(req, res, next) {
    const { idpedido, idestado, idpago } = req.body;
    if (idpedido == undefined || idestado == undefined) {
        res.status(400);
        res.json({codigo: '400', error : "Faltan valores, por favor verifique"});
    } else if (idestado == 2 && idpago == undefined) {
        res.status(400);
        res.json({codigo: '400', error : "Para confirmar un pedido tiene que seleccionar pago"});
    } else {
        next();
    }
};

async function validarPertenecniaPedido(req, res,next) {
    try {
        if (res.locals.rol != "1") {
            let ssql = sqlPedidos.sql_esPedidoDelUsuario(req.params.id, res.locals.id);
            var pedido = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
            if (pedido.length) {
                next();
            } else {
                res.status(403);
                res.json({codigo: '403', error : "El opcion no valida para el usuario"});
            }
        } else {
            next();
        }  
    } catch (error) {
        res.status(400);
        res.json({codigo: '400', error : "error al validar solicitud, verifique los datos enviados"});
    }
};

async function validarDatosDeleteCarrito(req, res, next) {
    const {idproducto} = req.body;
    if (!idproducto) {
        res.status(400);
        res.json({codigo: '400', error : "Faltan valores, por favor verifique"});
    } else {
        next();
    };  
};

// FIN FUNCIONES  /////////////////////////////////////////////////////////

module.exports = router 