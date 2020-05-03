import mongoose, { Schema } from 'mongoose';

interface Manager extends mongoose.Document {

}

const ManagerSchema = new Schema({

});

export const Manager = mongoose.model<Manager>('Manager', ManagerSchema);
