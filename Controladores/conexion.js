const Sequelize=require('sequelize');

const dataBase = "DelilahDB";
const puerto = '3306';
const tipoBase = 'mysql';
const host = 'localhost';
const usuariodb = 'root';
const passworddb = '';

const sql = new Sequelize(dataBase, usuariodb, passworddb, {
    host: host,
    dialect: tipoBase,
    port: puerto
  });

module.exports = sql;