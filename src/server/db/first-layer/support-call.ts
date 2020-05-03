import mongoose, { Schema } from 'mongoose';

interface SupportCall extends mongoose.Document {
	clientId: Schema.Types.ObjectId;
	problemId: Schema.Types.ObjectId;
	managerId: Schema.Types.ObjectId;
	timestamp: Date;
	clientWereWaiting: boolean;
	waitingDuration: number;
	wasHandled: boolean;
	callbackRequest: boolean;
	techIssuesDuration: number;
	willRecommend: boolean;
	satisfied: boolean;
}

const SupportCallSchema = new Schema({
	clientId: {
		type: Schema.Types.ObjectId,
		ref: 'Client'
	},
	problemId: {
		type: Schema.Types.ObjectId,
		ref: 'Problem'
	},
	managerId: {
		type: Schema.Types.ObjectId,
		ref: 'Manager'
	},
	timestamp: { type: Date, default: Date.now() },
	clientWereWaiting: { type: Boolean, default: false },
	waitingDuration: { type: Number, default: 0 },
	wasHandled: { type: Boolean, default: false },
	callbackRequest: { type: Boolean, default: false },
	techIssuesDuration: { type: Number, default: 0 },
	willRecommend: { type: Boolean, default: false },
	satisfied: { type: Boolean, default: false }
});

export const SupportCall = mongoose.model<SupportCall>('SupportCall', SupportCallSchema);
