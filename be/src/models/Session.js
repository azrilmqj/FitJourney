import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const Session = model(
  'Session',
  new Schema({
    hash: { type: String, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    expires: { type: Date, expires: 0 },
  }),
);
