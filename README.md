# JSApi
Este script es un servidor HTTP escrito en JavaScript que utiliza la librería 'mysql' para conectarse a una base de datos MySQL y ejecutar consultas a la base de datos. El servidor maneja cuatro tipos de solicitudes HTTP: GET, POST, PUT y DELETE. Cada tipo de solicitud tiene su propia función para manejarla. Cuando se envía una solicitud GET a la ruta '/version', el servidor devuelve una respuesta con la versión de la API. Si se envía una solicitud GET a otra ruta, el servidor devuelve resultados de una consulta a la base de datos MySQL. Si se envía una solicitud POST, PUT o DELETE, el servidor maneja la solicitud agregando, actualizando o eliminando datos en la base de datos MySQL, respectivamente. Si se envía una solicitud con un método no válido, el servidor devuelve un error. El servidor escucha en el puerto 80 y muestra un mensaje en la consola cuando se inicia.

## Iniciar el servidor
1. Primero se debe instalar 'mysql' y 'querystring'. 
2. ejecuta los siguientes comandos en la terminal:
```
npm install mysql
```
```
npm install querystring
```
## Configuracion
Debe configurar la conexión a la base de datos MySQL en la línea 16, especificando el host, el usuario, la contraseña y el nombre de la base de datos en los campos correspondientes.

## Manejar solicitudes GET
El servidor verifica la ruta de la solicitud en la línea 24. Si la ruta es '/version', se envía una respuesta con la versión de la API en la línea 29. Si la ruta es otra, se construye una consulta SQL para obtener datos de la tabla 'usuarios' en la base de datos MySQL. Si se envían parámetros en la solicitud, se añade una cláusula WHERE a la consulta para filtrar los resultados por el valor del parámetro enviado. Si el parámetro no es válido (es decir, no es un campo válido de la tabla 'usuarios'), se devuelve un error en la línea 45. Una vez construida la consulta, se ejecuta en la línea 49 y se envían los resultados como una respuesta JSON en la línea 55.

## Manejar solicitudes POST
Se reciben los datos enviados en la solicitud en las líneas 62 a 64 y se construye una consulta SQL para agregar una fila a la tabla 'usuarios' con los datos recibidos. Luego, se ejecuta la consulta en la línea 70 y se envía una respuesta en la línea 71.

## Manejar solicitudes PUT
Se reciben los datos enviados en la solicitud en las líneas 77 a 79 y se construye una consulta SQL para actualizar una fila en la tabla 'usuarios' con los datos recibidos. Luego, se ejecuta la consulta en la línea 85 y se envía una respuesta en la línea 86.

## Manejar solicitudes DELETE
Se construye una consulta SQL para eliminar una fila de la tabla 'usuarios' utilizando el parámetro enviado en la solicitud. Luego, se ejecuta la consulta en la línea 94 y se envía una respuesta en la línea 95.

Por último, el servidor escucha en el puerto especificado en la línea 14 y muestra un mensaje en la consola cuando se inicia en la línea 107.

## Ejemplos de solicitudes HTTP
Podrías enviar las siguientes solicitudes al servidor y luego te detallo la respuesta que recibirías:

### Solicitud GET a la ruta '/version':
Solicitud:
```
GET /version HTTP/1.1
Host: localhost
```
Respuesta:
```
HTTP/1.1 200 OK
Content-Type: application/json

{"version":"API creada con Javascript"}
```
### Solicitud GET a la ruta '/' sin parámetros:
Solicitud:
```
GET / HTTP/1.1
Host: localhost
```
Respuesta:
```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "nombre": "Juan", "edad": 32 },
  { "id": 2, "nombre": "Ana", "edad": 27 },
  { "id": 3, "nombre": "Pedro", "edad": 29 }
]
```
### Solicitud GET a la ruta '/' con el parámetro 'nombre':
Solicitud:
```
GET /?nombre=Ana HTTP/1.1
Host: localhost
```
Respuesta:
```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 2, "nombre": "Ana", "edad": 27 }
]
```
### Solicitud POST a la ruta '/' con datos:
Solicitud:
```
POST / HTTP/1.1
Content-Type: application/json
Content-Length: 32

{"nombre":"Luis","edad":31}
```
Respuesta:
```
HTTP/1.1 200 OK
Content-Type: application/json

{"fieldCount":0,"affectedRows":1,"insertId":4,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
```

# Enviar los datos
Para solicitudes POST, PUT o DELETE se deben seguir los siguientes pasos:

    1. Especificar el encabezado 'Content-Type' como 'application/json'. Esto indica que los datos que se están enviando están en formato JSON.
    2. Especificar el encabezado 'Content-Length' con el tamaño en bytes de los datos que se están enviando. Esto es necesario para que el servidor pueda leer los datos correctamente.
    3. Incluir los datos en formato JSON en el cuerpo de la solicitud. Los datos deben estar en forma de un objeto JSON con claves y valores correspondientes a los campos de la tabla 'usuarios' en la base de datos MySQL.
    4. Por ejemplo, si quieres agregar un nuevo usuario con el nombre "Juan" y la edad "32" a la tabla 'usuarios', debes enviar una solicitud POST con los siguientes encabezados y cuerpo:
```
POST / HTTP/1.1
Content-Type: application/json
Content-Length: 16

{"nombre":"Juan","edad":32}
```
Solicitud PUT con el parámetro 'id':
```
PUT /?id=3 HTTP/1.1
Content-Type: application/json
Content-Length: 16

{"nombre":"Juan","edad":32}
```
Solicitud DELETE con el parámetro 'id':
```
DELETE /?id=3 HTTP/1.1
```

### Los parámetros que puedes enviar en una solicitud GET son los siguientes:

> * 'nombre': filtra los resultados por el nombre del usuario.
> * 'id': filtra los resultados por el ID del usuario.
> * 'edad': filtra los resultados por la edad del usuario.

Por ejemplo, si quieres obtener todos los usuarios con el nombre "Juan", debes enviar una solicitud GET con el parámetro 'nombre':
```
GET /?nombre=Juan HTTP/1.1
```
Si quieres obtener todos los usuarios con una edad mayor a 30, debes enviar una solicitud GET con el parámetro 'edad':
```
GET /?edad>30 HTTP/1.1
```
## Solicitud GET

Si se envía una solicitud GET y se encuentran resultados, se recibirá una respuesta con un código de estado 200 y un arreglo JSON con los resultados.
Si se envía una solicitud GET y no se encuentran resultados, se recibirá una respuesta con un código de estado 200 y un arreglo vacío.
Si se envía una solicitud GET con un parámetro no válido, se recibirá una respuesta con un código de estado 400 y un objeto JSON con un mensaje de error.

## Solicitud POST

Si se envía una solicitud POST y se inserta correctamente un nuevo registro en la base de datos, se recibirá una respuesta con un código de estado 200 y un objeto JSON con información sobre la operación de inserción.
Si se envía una solicitud POST con datos inválidos, se recibirá una respuesta con un código de estado 500 y un objeto JSON con un mensaje de error.

## Solicitud PUT

Si se envía una solicitud PUT y se actualiza correctamente un registro en la base de datos, se recibirá una respuesta con un código de estado 200 y un objeto JSON con información sobre la operación de actualización.
Si se envía una solicitud PUT con datos inválidos o un ID no válido, se recibirá una respuesta con un código de estado 500 y un objeto JSON con un mensaje de error.

## Solicitud DELETE

Si se envía una solicitud DELETE y se elimina correctamente un registro de la base de datos, se recibirá una respuesta con un código de estado 200 y un objeto JSON con información sobre la operación de eliminación.
Si se envía una solicitud DELETE con un ID no válido, se recibirá una respuesta con un código de estado 500 y un objeto JSON con un mensaje de error.


Eso por el momento, estare actualizando el codigo saludos ante cualquier duda o consulta miguel.php@gmail.com
