
function SQL_Login(usu, pass) {
    var sql = "select id, usuario, nombre, id_rol FROM usuarios ";
    sql = sql + "WHERE (usuario = '" + usu + "' OR email = '" + usu + "') AND PASSWORD = MD5('" + pass + "')";
    return sql;
};

function SQL_RolUsuario(usu) {
    var sql = "select usuario  FROM usuarios ";
    sql = sql + "WHERE usuario = '" + usu + "' AND id_rol = 1 AND bloqueado <> 'S'";
    return sql;
};

module.exports = { 
    SQL_Login,
    SQL_RolUsuario
};