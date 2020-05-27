const express=require('express');
const bodyp =require('body-parser');
const usuario = require('./Controladores/usuarios.js');
// const sqlGral = require('./AdministradorSQL/AdministradorGral.js');
// const cn = require('./Controladores/conexion');
// const valores = require('./constantes');
// const jwt=require('jsonwebtoken');
const producto = require('./Controladores/productos');
const login = require('./Controladores/login');
const pedido = require('./Controladores/pedidos');

const server = express();


server.use(bodyp.json());
server.use('/usuarios', usuario);
server.use('/productos', producto);
server.use('/login', login);
server.use('/pedidos', pedido);


// server.post("/login", async (req, res) => {
//     const {user, pass} = req.body;
//     if (!user || !pass) {
//         res.status(400);
//         res.json({ codigo: '400', mensaje : "Datos incompletos, verifique"});
//     } else {
//         var ssql = sqlGral.SQL_Login(user, pass);
//         let resultado = await cn.query(ssql, { type : cn.QueryTypes.SELECT});
//         if (resultado.length) {
//             let stoken=jwt.sign(resultado[0].usuario, valores.firma);
//             res.status(200);
//             res.json({ token : stoken, rol: resultado[0].id_rol, nombre: resultado[0].nombre });
//         } else {
//             res.status(401);
//             res.json({ codigo: '401', mensaje : "El usuario o el password son incorrectos, verfique"});
//         }
//     }
// });

server.listen(5500, () => {
	console.log('Servidor Iniciado en puerto 5500...');
});
