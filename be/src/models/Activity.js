import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  date: String,
  water: { type: Number, default: 0 },
  workouts: [{ workout: String, title: String, duration: Number }],
});
activitySchema.index({ user: 1, date: 1 }, { unique: true });
export const Activity = model('Activity', activitySchema);
