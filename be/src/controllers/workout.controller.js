import { Workout } from '../models/index.js';
import { fail } from '../utils/AppError.js';

export const listWorkouts = async (req, res) =>
  res.json(await Workout.find({ status: 'published' }).sort({ createdAt: -1 }).limit(200));

export const getWorkout = async (req, res) => {
  const item = await Workout.findOne({ _id: req.params.id, status: 'published' });
  if (!item) throw fail(404, 'Workout not found.');
  res.json(item);
};
