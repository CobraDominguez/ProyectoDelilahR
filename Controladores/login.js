var cn = require('./conexion');
var express = require('express')
const bodyp =require('body-parser');
const valores = require('../constantes');
const jwt=require('jsonwebtoken');
const sqlGral = require('../AdministradorSQL/AdministradorGral.js');

var router = express.Router()
router.use(bodyp.json());

router.post("/", verificarDatos, async (req, res) => {
    var ssql = sqlGral.SQL_Login(res.locals.user, res.locals.pass);
    let resultado = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
    if (resultado.length) {
        let valenca = getRandomInt(001,999);
        let valpie = getRandomInt(01,99);
        let stoken=jwt.sign(valenca+'|'+resultado[0].id+'|'+resultado[0].usuario+'|'+resultado[0].id_rol+'|'+valpie, valores.firma);
        res.status(200);
        res.json({ token : stoken, rol: resultado[0].id_rol, nombre: resultado[0].nombre });
    } else {
        res.status(401);
        res.json({ codigo: '401', mensaje : "El usuario o el password son incorrectos, verfique"});
    }
});


//  FUNCIONES //////////////////////////////////////////////////////////////


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

// ************************   MIDDLEWARE   *********************************
function verificarDatos(req, res, next) {
    const {user, pass} = req.body;
    if (!user || !pass) {
        res.status(400);
        res.json({ codigo: '400', mensaje : "Datos incompletos, verifique"});
    } else {
        res.locals.user = user;
        res.locals.pass = pass;
        next();
    }
};

// FIN FUNCIONES  /////////////////////////////////////////////////////////

module.exports = router 