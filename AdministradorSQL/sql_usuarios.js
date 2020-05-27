function SQL_listaUsuarios() {
    var sql = "SELECT u.id, u.usuario, u.nombre, u.domicilio, u.email, u.telefono, r.descripcion rol, bloqueado = 'S' bloqueado  "
    sql = sql + "FROM usuarios u JOIN roles r ON u.id_rol = r.id WHERE activo = 'S'" 
    return sql;
};

function SQL_VerificarDisponibilidad(usu, mail) {
    var sql = "SELECT usuario FROM usuarios "
    sql = sql + "WHERE usuario = '" + usu + "' OR email = '" + mail + "'"
    return sql;
};

function SQL_INSERT(usu, nom, dom, mail, pass, tel) {
    var sql = "INSERT INTO usuarios VALUES (NULL, 2, ";
    sql = sql + "'"+ usu + "', MD5('" + pass + "'), '" + nom + "', '" + mail + "', '" + dom + "', '" + tel + "', 'N', 'S')";
    return sql;
};

function SQL_ESADMIND(usu) {
    var sql = "SELECT id_rol FROM usuarios WHERE usuario = '" + usu + "' AND id_rol = 1";
    return sql;
};

function SQL_SELECTUSUARIO(id, usu, esAdmind) {
    var sql = "SELECT u.id, u.usuario, u.nombre, u.domicilio, u.email, u.telefono, r.descripcion rol, bloqueado = 'S' bloqueado  FROM usuarios u JOIN roles r ON u.id_rol = r.id ";
    sql = sql + "WHERE u.id = " + id;
    if (!esAdmind) {
        sql = sql + " AND u.usuario = '" + usu + "'";
    }
    return sql;
};

function SQL_UPDATEUSUARIO(id, usu, rol, nom, dom, bloq, pass, tel, esAdmind) {
    if (bloq == true) {
        bloq = 'S';
    } else {
        bloq = 'N';
    }
    var sql = "UPDATE usuarios SET id_rol = " + rol + ", nombre = '" + nom + "', domicilio = '" + dom + "', telefono = '" + tel + "', bloqueado = '" + bloq + "', password = MD5('" + pass + "')";
    sql = sql + " wHERE id = " + id;
    if (!esAdmind) {
        sql = sql + " AND usuario = '" + usu + "'";
    }
    return sql;
};

function SQL_PUEDEELIMINAR(id) {
    var sql = "SELECT p.id FROM usuarios u JOIN pedidos p ON u.id = p.id_usuario WHERE u.id = " + id + " AND p.id_estado < 6";
    return sql;
};

function SQLDELETEUSUARIO(id, usu, esAdmind) {
    var sql = "UPDATE usuarios set activo = 'N'  WHERE id = " + id;
    if (!esAdmind) {
        sql = sql + " AND usuario = '" + usu + "'";
    }
    return sql;
};

module.exports = { 
    SQL_listaUsuarios,
    SQL_VerificarDisponibilidad,
    SQL_INSERT,
    SQL_ESADMIND,
    SQL_SELECTUSUARIO,
    SQL_UPDATEUSUARIO,
    SQL_PUEDEELIMINAR,
    SQLDELETEUSUARIO
};