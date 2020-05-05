import express from 'express';

import initDb from './db/index';
import { IClient } from './db/first-layer';

const server = express();
let schemas: any;

server.get('/', function (req, res) {
	res.send('Hello World!');
});

server.get('/api/kpi/:code', (req, res) => {
	const kpiCode = req.params.code;
	let schema: any = false;

	if (Object.keys(schemas.firstLayerSchemas).includes(kpiCode)) {
		schema =
			schemas.firstLayerSchemas[Object.keys(schemas.firstLayerSchemas).find(code => code === kpiCode)];
	}

	if (Object.keys(schemas.secondLayerSchemas).includes(kpiCode)) {
		schema =
			schemas.secondLayerSchemas[Object.keys(schemas.secondLayerSchemas).find(code => code === kpiCode)];
	}

	if (Object.keys(schemas.thirdLayerSchemas).includes(kpiCode)) {
		schema =
			schemas.thirdLayerSchemas[Object.keys(schemas.thirdLayerSchemas).find(code => code === kpiCode)];
	}

	if (kpiCode === 'NetPromoterScore') {
		const clients = schemas.firstLayerSchemas.clients;

		schema = (100 * clients.filter((client: IClient) => client.willRecommend).length) / clients.length;
	}

	if (kpiCode === 'CustomerSatisfaction') {
		const clients = schemas.firstLayerSchemas.clients;

		schema = (100 * clients.filter((client: IClient) => client.satisfied).length) / clients.length;
	}

	if (kpiCode === 'CustomerEffortScore') {
		const clients = schemas.firstLayerSchemas.clients;

		schema = (100 * clients.filter((client: IClient) => client.hardToWork).length) / clients.length;
	}

	res.json(schema);
});

server.listen(3000, async function () {
	console.log('Example server listening on port 3000!');

	schemas = await initDb(100, 50);
});
