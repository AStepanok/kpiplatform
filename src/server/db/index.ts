import mongoose from 'mongoose';

import {
	Client
} from './first-layer';

export default function () {
	mongoose.connect('mongodb://localhost:27017/kpi-platform-db');

	Client.collection.drop();
	Client.create({});
}
