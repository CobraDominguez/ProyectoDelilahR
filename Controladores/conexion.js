const Sequelize=require('sequelize');

const sql = new Sequelize('mysql://root@localhost:3306/DelilahDB');

module.exports = sql;