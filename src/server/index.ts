import express from 'express';

import initDb from './db/index';

const server = express();
initDb(100, 10);

server.get('/', function (req, res) {
	res.send('Hello World!');
});

server.listen(3000, function () {
	console.log('Example server listening on port 3000!');
});
