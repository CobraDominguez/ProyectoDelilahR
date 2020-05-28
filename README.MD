Proyecto Delilah Restó

Una API para la gestion de pedidos, productos y usuarios por roles.



Comenzando 🚀

Estas instrucciones te permitirán a partir de una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

a) descarga el proyecto desde github o bien a partir del archivo RAR adjunto a una ruta local en su maquina.
Consideraciones:

Los estados existentes son los siguientes:
1 Nuevo
2 Pendinte
3 Confirmado
4 Preparando
5 Enviando
6 Entregado
7 Cancelado

Todos los estados pedidos hasta que son Confirmados por el usuario tienen estado "Nuevo" y no salen en la lista del administrador.



WORKFLOW:

Tiene el siguiente Flujo de trabajo, un usuario quiere generar un pedido, selecciona el primer producto y su cantidad y lo agrega al carrito, puede realizar esta accion tantas veces como quiera hasta que considere que su carrito ya esta finalizado, es entonces en donde el mismo lo confirma y pasa a un estado "Pendiente" actualizando el total y la fecha  (se genero el pedido con la lista de productos seleccionados por el usuario), donde el/los Administradores podran ver y confirmar, una vez que estos lo confirman pasa a estado "Confirmado".
El sisitema no hace eliminacion de registros de Usuarios y productos dado que los mismo podrian dejar inconsistentes los datos de la base de datos, por ello las tablas tienen un campo "activo" el cual indica si esta o no eliminado. A si mismo los pedidos, tampoco se elimina simplemente se cancelan (no es tenido en cuenta).
Sin embargo, el registro de productos favoritos puede eliminarse.



los Medios de Pagos Cargados son los siguientes:
"1"	"Efectivo"
"2"	"Credito VISA"
"3"	"Credito AMEX"
"4"	"Credito Master"
"5"	"Debito VISA"
"6"	"Debito Master"







Pre-requisitos 📋
Tener instalado XAMPP u otro server que nos permita levantar MySQL.
Para el codigo:
    tener instalado visual Studio Code.
Para Testeo:
    tener instalado Postman.



Instalación 🔧

1) Armar la Base de datos:
    Ejecutar el archivo "DelilahDB.sql" en una pestaña query de MySQL. Este archivo crea la base de datos y utiliza la misma para crar las tablas necesarias asi como tambien sus relaciones.
2) Ejecutar STARTUP:
    Ejecutar el archivo "STARTUP.sql" en una pestaña apuntando a la base de Delilahdb. Este archivo carga los valores necesario para una correcta implementacion del sistema.
3) Ejecutar Carga de Testeo (opcional: solo si se desea realizar pruebas con datos precargados)
    Ejecutar el archivo "Productos_Test.sql" en una pestaña apuntando a la base de Delilahdb. Este archivo carga los registros necesarios para inciar una prueba pasando por todos los circuitos disponibles en la API.
4) Cargar los datos de conexion a la base de datos en el archivo conexion.js ubicado en "./Controladores" con los siguientes datos:

        dataBase =  Nombre de la Base de Datos por defecto: "DelilahDB"
        puerto = Puerto de conexion a la Base de Datos por defecto: '3306'
        tipoBase = que motor de base de datos emplea, por ddefecto: 'mysql'
        host = Direccion de acceso a la base de datos, por defecto: 'localhost'
        usuariodb = Usuario de conexion a la Base de Datos, por defecto:  'root'
        passworddb = la clave de conexion a la base de datos, por defecto: ''



Ejecutando las pruebas ⚙️

Para teniendio isntalado el postman y corrido el script de testeo (opcional), se puede realizar una prueba rapida importando el archivo adjunto "delilah.postman_collection.json" desde postman, el mismo contiene 49 requeest para realizar una prueba integral de las rutas.



Construido con 🛠️

NodeJS , JAVASCRIPT, MySQL




Autor ✒️

Dominguez Carlos Alberto
