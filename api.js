const http = require('http');
const mysql = require('mysql');
const url = require('url');
const querystring = require('querystring');

//const hostname = '127.0.0.1';
const port = 80;

// Crea una conexión a la base de datos MySQL
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'sistema'
});

connection.connect();


const server = http.createServer((req, res) => {
	// Obtiene la URL de la solicitud y los datos enviados en la solicitud
	const parsedUrl = url.parse(req.url);
	const parsedQuery = querystring.parse(parsedUrl.query);

	// Verifica el método de la solicitud
	if (req.method === 'GET') {
		// Maneja la solicitud GET
		handleGetRequest(parsedUrl, parsedQuery, res, req);
	} else if (req.method === 'POST') {
		// Maneja la solicitud POST
		handlePostRequest(req, res);
	} else if (req.method === 'PUT') {
		// Maneja la solicitud PUT
		handlePutRequest(req, res);
	} else if (req.method === 'DELETE') {
		// Maneja la solicitud DELETE
		handleDeleteRequest(parsedQuery, res);
	} else {
		// Devuelve un error si el método de la solicitud no es válido
		res.statusCode = 405;
		res.end();
	}
});


server.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://${server.address().address}:${port}/`);
});

// Función para manejar solicitudes GET 
function handleGetRequest(parsedUrl, query, res) {
  // Si la ruta de la solicitud es '/version'
  if (parsedUrl.pathname === '/version') {
    // Envía una respuesta con la versión de la API
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ version: 'API creada con Javascript' }));
  } else {
    // Si no se envían parámetros en la solicitud, se obtienen todos los resultados
    let sql = 'SELECT * FROM usuarios';
    if (Object.keys(query).length !== 0) {
      // Si se envían parámetros, se realiza una consulta WHERE
      // pero solo si el parámetro es un campo válido de la tabla
      const validFields = ['nombre', 'id', 'edad'];
      const field = Object.keys(query)[0];
      if (validFields.includes(field)) {
        sql += ` WHERE ${field} = "${query[field]}"`;
      } else {
        // Si el parámetro no es válido, se devuelve un error
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid parameter' }));
        return;
      }
    }
    // Ejecuta la consulta a la base de datos MySQL
    connection.query(sql, (error, results) => {
      if (error) throw error;

      // Devuelve los resultados de la consulta como una respuesta JSON
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    });
  }
}


// Función para manejar solicitudes POST
function handlePostRequest(req, res) {
	// Recibe los datos enviados en la solicitud
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		// Convierte el payload en un objeto JSON
		const data = JSON.parse(body);

		// Ejecuta una consulta INSERT a la base de datos MySQL
		connection.query('INSERT INTO usuarios SET ?', data, (error, results) => {
			if (error) throw error;

			// Devuelve el resultado de la consulta como una respuesta JSON
			res.statusCode = 201;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({
				solicitud: 'ok'
			}));
		});
	});
}

// Función para manejar solicitudes PUT
function handlePutRequest(req, res) {
	// Recibe los datos enviados en la solicitud
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		// Convierte los datos enviados en la solicitud a formato JSON
		const data = JSON.parse(body);
		// Ejecuta una consulta UPDATE a la base de datos MySQL
		connection.query('UPDATE usuarios SET ? WHERE id = ?', [data, data.id], (error, results) => {
			if (error) throw error;

			// Devuelve el resultado de la consulta como una respuesta JSON
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(results));
		});
	});
}

function handleDeleteRequest(query, res) {
  // Si no se envía el ID del usuario en la solicitud, se devuelve un error
if (!query.id) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'ID not provided' }));
  return;
}

  // Ejecuta una consulta DELETE a la base de datos MySQL
  connection.query('DELETE FROM usuarios WHERE id = ?', [query.id], (error, results) => {
    if (error) throw error;

    // Devuelve el resultado de la consulta como una respuesta JSON
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
  });
}
