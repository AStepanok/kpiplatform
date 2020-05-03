import express from 'express';

const server: any = express();

server.get('/', function (req, res) {
	res.send('Hello World!');
});

server.listen(3000, function () {
	console.log('Example server listening on port 3000!');
});
