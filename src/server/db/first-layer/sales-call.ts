import mongoose, { Schema } from 'mongoose';

interface SalesCall extends mongoose.Document {
	managerId: Schema.Types.ObjectId;
	timestamp: Date;
	successful: boolean;
	revenue: number;
	duration: number;
}

const SalesCallSchema = new Schema({
	managerId: {
		type: Schema.Types.ObjectId,
		ref: 'Manager'
	},
	timestamp: { type: Date, default: Date.now() },
	successful: { type: Boolean, default: false },
	revenue: { type: Number, default: 0 },
	duration: { type: Number, default: 0 }
});

export const SalesCall = mongoose.model<SalesCall>('SalesCall', SalesCallSchema);
