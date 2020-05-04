import mongoose, { Schema } from 'mongoose';

export type SupportCallType = {
	clientId: Schema.Types.ObjectId;
	problemId: Schema.Types.ObjectId;
	managerId: Schema.Types.ObjectId;
	timestamp: string;
	clientWereWaiting: boolean;
	waitingDuration: number;
	wasHandled: boolean;
	callbackRequest: boolean;
	techIssuesDuration: number;
	duration: number;
	solvedProblem: boolean;
}

export interface ISupportCall extends mongoose.Document {
	clientId: Schema.Types.ObjectId;
	problemId: Schema.Types.ObjectId;
	managerId: Schema.Types.ObjectId;
	timestamp: string;
	clientWereWaiting: boolean;
	waitingDuration: number;
	wasHandled: boolean;
	callbackRequest: boolean;
	techIssuesDuration: number;
	duration: number;
	solvedProblem: boolean;
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
	timestamp: { type: String, default: '' },
	clientWereWaiting: { type: Boolean, default: false },
	waitingDuration: { type: Number, default: 0 },
	wasHandled: { type: Boolean, default: false },
	callbackRequest: { type: Boolean, default: false },
	techIssuesDuration: { type: Number, default: 0 },
	duration: { type: Number, default: 0 },
	solvedProblem: { type: Boolean, default: false },
});

export const SupportCall = mongoose.model<ISupportCall>('SupportCall', SupportCallSchema);
