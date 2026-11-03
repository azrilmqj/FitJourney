import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const Progress = model(
  'Progress',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      date: String,
      weight: Number,
      bodyFat: Number,
      sleep: Number,
      notes: String,
      photo: String,
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
    },
    { timestamps: true },
  ),
);
