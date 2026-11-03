import mongoose from 'mongoose';
import { env } from './env.js';

export function connectDatabase() {
  return mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}
