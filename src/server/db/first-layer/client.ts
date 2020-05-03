import mongoose, { Schema } from 'mongoose';

export type ClientType = {
	hardToWork: boolean;
	willRecommend: boolean;
	satisfied: boolean;
}

export interface IClient extends mongoose.Document {
	hardToWork: boolean;
	willRecommend: boolean;
	satisfied: boolean;
}

const ClientSchema = new Schema({
	hardToWork: { type: Boolean, default: true },
	willRecommend: { type: Boolean, default: false },
	satisfied: { type: Boolean, default: false }
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);
