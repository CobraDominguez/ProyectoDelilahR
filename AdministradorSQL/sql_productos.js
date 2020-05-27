function SQL_listaProductosLIBRE() {
    var sql = "SELECT id, descripcion, precio, url_imagen imagen, enstock stock, 0 favorito FROM productos where activo = 'S'";
    return sql;
};

function SQL_listaProductosPORID(id) {
    var sql = "SELECT p.id, p.descripcion, p.precio, p.url_imagen imagen, p.enstock stock, case when IFNULL(f.id_producto,0) = 0 then 0 ELSE 1 end favorito  FROM productos p left JOIN productos_favoritos f ON p.id = f.id_producto AND f.id_usuario = " + id + " left JOIN usuarios u ON u.id = f.id_usuario where p.activo = 'S'";
    return sql;
};

function SQL_INSERT(des, pre, url, stock) {
    if (stock == true) {
        stock = 'S';
    } else {
        stock = 'N';
    }
    var sql = "INSERT INTO productos (descripcion, precio, ";
    if (url != undefined) {
        sql = sql + "url_imagen, "; 
    }
    sql = sql + "enstock, activo) VALUES ";
    sql = sql + "('" + des + "', '" + pre + "', ";
    if (url != undefined) {
        sql = sql + "'" + url + "', ";
    }
    sql = sql + "'" + stock + "', 'S')";
    return sql;
};

function SQL_ESADMIND(usu) {
    var sql = "SELECT id_rol FROM usuarios WHERE usuario = '" + usu + "' AND id_rol = 1";
    return sql;
};

function SQL_CONSULTAPORID(id) {
    var sql = "SELECT id, descripcion, precio, url_imagen imagen, enstock stock, 0 favorito FROM productos where id = " + id;
    return sql;
};

function SQL_UPDATEPROD(id, des, pre, url, stock) {
    if (stock == true) {
        stock = 'S';
    } else {
        stock = 'N';
    };
    var sql = "UPDATE productos SET descripcion = '" + des + "', precio = " + pre + ", ";
    if (url != undefined) {
        sql = sql + "url_imagen = '" + url + "', ";
    }
    sql = sql + "enstock = '" + stock + "' WHERE id = " + id;
    return sql;
};

function SQL_PuedeEliminar(id) {
    var sql = "SELECT e.id FROM productos p left JOIN detalle_pedido d ON d.id_producto = p.id left JOIN pedidos e ON d.id_pedido = e.id AND e.id_estado < 5 WHERE p.id =" + id;
    return sql;
};

function SQL_DELETEPROD(id) {
   var sql = "update Productos set activo = 'N' where id =" + id;
   return sql;
};

function sql_AgregarFavorito(idprod, idusu) {
    var sql = "INSERT INTO productos_favoritos values(" + idprod + ", " + idusu + ")";
    return sql;
};

function sql_TieneFavorito(idprod, idusu) {
    var sql = "SELECT * from productos_favoritos where id_producto = " + idprod + " AND id_usuario = " + idusu;
    return sql;
};

function sql_EliminarFavorito(idprod, idusu) {
    var sql = "delete FROM productos_favoritos where id_producto = " + idprod + " AND id_usuario = " + idusu;  
    return sql;
};


module.exports = { 
    SQL_listaProductosLIBRE,
    SQL_listaProductosPORID,
    SQL_INSERT,
    SQL_ESADMIND,
    SQL_CONSULTAPORID,
    SQL_UPDATEPROD,
    SQL_PuedeEliminar,
    SQL_DELETEPROD,
    sql_AgregarFavorito,
    sql_TieneFavorito,
    sql_EliminarFavorito
};