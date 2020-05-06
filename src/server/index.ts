import express from 'express';


import initDb from './db/index';
import { IClient } from './db/first-layer';
import routes from './routes';
import {getRandomBoolean} from '../utils/random';

const server = express();
export let schemas: any;
server.use(express.static('build'));

Object.keys(routes).forEach((routeKey: keyof typeof routes) => {
	server.use('/', routes[routeKey]);
});

server.listen(3000, async function () {
	console.log('Example server listening on port 3000!');

	schemas = await initDb(1, 1);
});
