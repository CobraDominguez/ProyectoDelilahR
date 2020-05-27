Proyecto Delilah Restó
Una API para la gestion de pedidos, productos y usuarios por roles.

Comenzando 🚀
Estas instrucciones te permitirán a partir de una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.
a) descarga el proyecto desde github o bien a partir del archivo RAR adjunto a una ruta local en su maquina.


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


Ejecutando las pruebas ⚙️
Para teniendio isntalado el postman y corrido el script de testeo (opcional), se puede realizar una prueba rapida importando el archivo adjunto "delilah.postman_collection.json" desde postman, el mismo contiene 49 requeest para realizar una prueba integral de las rutas.


Construido con 🛠️
NodeJS , JAVASCRIPT, MySQL


Autor ✒️
Dominguez Carlos Alberto
