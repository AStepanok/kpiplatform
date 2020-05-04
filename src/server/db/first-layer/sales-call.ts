import mongoose, { Schema } from 'mongoose';

export type SalesCallType = {
	managerId: Schema.Types.ObjectId;
	timestamp: string;
	successful: boolean;
	revenue: number;
	duration: number;
};

export interface ISalesCall extends mongoose.Document {
	managerId: Schema.Types.ObjectId;
	timestamp: string;
	successful: boolean;
	revenue: number;
	duration: number;
}

const SalesCallSchema = new Schema({
	managerId: {
		type: Schema.Types.ObjectId,
		ref: 'Manager'
	},
	timestamp: { type: String, default: '' },
	successful: { type: Boolean, default: false },
	revenue: { type: Number, default: 0 },
	duration: { type: Number, default: 0 }
});

export const SalesCall = mongoose.model<ISalesCall>('SalesCall', SalesCallSchema);
