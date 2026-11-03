import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const Reset = model(
  'Reset',
  new Schema({
    hash: { type: String, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    expires: { type: Date, expires: 0 },
  }),
);
