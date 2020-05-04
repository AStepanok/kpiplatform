import mongoose from 'mongoose';

import initFirstLayer from './first-layer';
import initSecondLayer from './second-layer';

export default async function (numOfClients: number, numOfManagers: number) {
	mongoose.connect('mongodb://localhost:27017/kpi-platform-db');

	const firstLayerSchemas = await initFirstLayer(numOfClients, numOfManagers);
	const secondLayerSchemas = await initSecondLayer(firstLayerSchemas);
}
