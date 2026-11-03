import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile: {
      age: Number,
      gender: String,
      height: Number,
      weight: Number,
      goal: String,
      activity: Number,
      location: String,
      dob: String,
      bio: String,
      avatar: String,
    },
    onboarded: { type: Boolean, default: false },
    notificationsReadAt: { type: Date, default: null },
    notifications: { type: Boolean, default: true },
    target: { calories: Number, protein: Number, carbs: Number, fat: Number },
  },
  { timestamps: true },
);
export const User = model('User', userSchema);
