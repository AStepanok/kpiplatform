import mongoose, { Schema } from 'mongoose';

interface AfterSupportCallWork extends mongoose.Document {
	callId: Schema.Types.ObjectId;
	problemId: Schema.Types.ObjectId;
	managerId: Schema.Types.ObjectId;
	duration: number;
}

const AfterSupportCallWorkSchema = new Schema({
	callId: {
		type: Schema.Types.ObjectId,
		ref: 'SupportCall'
	},
	problemId: {
		type: Schema.Types.ObjectId,
		ref: 'Problem'
	},
	managerId: {
		type: Schema.Types.ObjectId,
		ref: 'Manager'
	},
	duration: { type: Number, default: 0 }
});

export const AfterSupportCallWork =
	mongoose.model<AfterSupportCallWork>('AfterSupportCallWork', AfterSupportCallWorkSchema);
