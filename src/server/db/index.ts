import mongoose from 'mongoose';

import initFirstLayer, {IClient} from './first-layer';
import initSecondLayer from './second-layer';
import initThirdLayer from './third-layer';

export default async function (numOfClients: number, numOfManagers: number) {
	mongoose.connect('mongodb://localhost:27017/kpi-platform-db');

	const firstLayerSchemas = await initFirstLayer(numOfClients, numOfManagers);
	const secondLayerSchemas = await initSecondLayer(firstLayerSchemas);
	const thirdLayerSchemas = await initThirdLayer(secondLayerSchemas, firstLayerSchemas);

	const { clients } = firstLayerSchemas;
	thirdLayerSchemas.CustomerEffortScore =
		(100 * clients.filter((client: IClient) => client.hardToWork).length) / clients.length;
	thirdLayerSchemas.CustomerSatisfaction =
		(100 * clients.filter((client: IClient) => client.satisfied).length) / clients.length;
	thirdLayerSchemas.NetPromoterScore =
		(100 * clients.filter((client: IClient) => client.willRecommend).length) / clients.length;

	console.log('done :)');

	return {
		firstLayerSchemas,
		secondLayerSchemas,
		thirdLayerSchemas
	};
}
