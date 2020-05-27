function sql_ConsultaPedidoporID(rol, idusu, id) {
    var sql = "SELECT p.id, u.id idusuario, u.nombre descripcionusu, p.id_estado idestado, est.descripcion estado, p.total total, p.fecha fecha, p.id_pago idmediopago, m.descripcion  ";
    sql = sql + "FROM pedidos p JOIN usuarios u ON u.id = p.id_usuario JOIN medios_pagos m ON m.id = p.id_pago JOIN estados est ON est.id = p.id_estado WHERE";
    if (rol != "1") {
        sql = sql + " u.id = " + idusu + " AND ";
    };
    sql = sql + " p.id = " + id + " ";
    sql = sql + " ORDER BY est.id";
    return sql;
};

function sql_ListadoPedidos(rol, idusu) {
    var sql = "SELECT p.id_estado idestado, est.descripcion estado, p.fecha fecha, CONCAT('#',p.id) numero , GROUP_CONCAT(d.cantidad,'x ',prod.descripcion) descripcion , p.id_pago idmediopago, m.descripcion pago,  p.total total,  p.id, u.id idusuario, u.nombre descripcionusu, u.domicilio ";
    sql = sql + "FROM pedidos p JOIN detalle_pedido d ON d.id_pedido = p.id JOIN productos prod ON prod.id = d.id_producto  JOIN usuarios u ON u.id = p.id_usuario JOIN medios_pagos m ON m.id = p.id_pago JOIN estados est ON est.id = p.id_estado ";
    if (rol != "1") {
        sql = sql + "WHERE u.id = " + idusu + " AND p.id_estado > 1 ";
    };
    sql = sql + "GROUP BY d.id_pedido ";
    sql = sql + "ORDER BY est.id"
    return sql;
};

function sql_DetallePedidoPorID(idpedido) {
    var sql = "SELECT d.id_pedido idpedido, d.id_producto idproducto, p.descripcion descripcionprod, d.cantidad, d.precio ";
    sql = sql + "FROM detalle_pedido d JOIN productos p ON p.id = d.id_producto ";
    sql = sql + "WHERE d.id_pedido = " + idpedido;
    return sql;
};

function sql_haycarritoencurso(idusu) {
    var sql = "SELECT * from pedidos WHERE id_estado = 1 AND id_usuario = " + idusu;
    return sql;
};

function sql_armarpedidocarrito(idusu) {
    var sql = "INSERT INTO pedidos SELECT NULL, 111, NOW(), 1, 1, " + idusu;
    return sql;
};

function sql_armarinsertCarrito(idped, idprod, cant) {
    var sql = "INSERT INTO detalle_pedido SELECT " + idped + ", " + idprod + ", " + cant + ", precio FROM productos WHERE id = " + idprod;
    return sql;
};

function sql_obtenertotalyfecha(id, idusuario) {
    var sql = "SELECT p.id, SUM(d.precio * d.cantidad) total, NOW() fecha FROM pedidos p JOIN detalle_pedido d ON p.id = d.id_pedido ";
    sql = sql + "WHERE id = " + id + "  AND id_usuario = " + idusuario;
    sql = sql + " GROUP BY d.id_pedido";
    return sql;  
};

function sql_confirmarpedidousuario(total, id, idpago) {
    var sql = "UPDATE pedidos SET total = " + total + ", fecha = NOW(), id_estado = 2, id_pago = " + idpago + " WHERE id = " + id;
    return sql;
};

function sql_cambiarEstadoPedido(idestado, id) {
    var sql = "UPDATE pedidos SET id_estado = " + idestado + " WHERE id = " + id;
    return sql;
};

function sql_cancelarPedido(id, rol) {
    var sql = "UPDATE pedidos set id_estado = 7 WHERE id=" + id; 
    if (rol != "1") {
        sql = sql + " AND id_estado < 5"
    }
    return sql;
};

function sql_esPedidoDelUsuario(id, idusu) {
    var sql = "SELECT * FROM pedidos WHERE id= " + id + " AND id_usuario = " + idusu;  
    return sql;
};

module.exports = { 
    sql_ListadoPedidos,
    sql_ConsultaPedidoporID,
    sql_DetallePedidoPorID,
    sql_haycarritoencurso,
    sql_armarpedidocarrito,
    sql_armarinsertCarrito,
    sql_obtenertotalyfecha,
    sql_confirmarpedidousuario,
    sql_cambiarEstadoPedido,
    sql_cancelarPedido,
    sql_esPedidoDelUsuario
};