import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const Workout = model(
  'Workout',
  new Schema(
    {
      title: String,
      description: String,
      category: String,
      level: String,
      duration: Number,
      trainer: String,
      target: String,
      image: String,
      videoId: String,
      exercises: [String],
      status: { type: String, default: 'published' },
    },
    { timestamps: true },
  ),
);
