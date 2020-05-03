import mongoose, { Schema } from 'mongoose';

export interface IManager extends mongoose.Document {

}

const ManagerSchema = new Schema({

});

export const Manager = mongoose.model<IManager>('Manager', ManagerSchema);
