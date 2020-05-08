import mongoose, { Schema } from 'mongoose';

export type KPIType = {
	code: string;
	linkedKPICodes: string[];
	rootKPI: string;
}

export interface IKPI extends mongoose.Document {
	code: string;
	linkedKPICodes: string[];
	rootKPI: string;
}

const KPISchema = new Schema({
	code: { type: String, default: '' },
	linkedKPICodes: { type: [String], default: [] },
	rootKPI: { type: String, default: '' },
});

export const KPI = mongoose.model<IKPI>('KPI', KPISchema);
