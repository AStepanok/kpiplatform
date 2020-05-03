import mongoose, { Schema } from 'mongoose';

interface Problem extends mongoose.Document {
	clientId: Schema.Types.ObjectId;
	status: string;
	new: boolean;
}

const ProblemSchema = new Schema({
	clientId: {
		type: Schema.Types.ObjectId,
		ref: 'Client'
	},
	status: { type: String, default: 'In Progress' },
	new: { type: Boolean, default: false }
});

export const Problem = mongoose.model<Problem>('Problem', ProblemSchema);
