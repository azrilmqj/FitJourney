import { Activity, Workout } from '../models/index.js';
import { fail } from '../utils/AppError.js';

export const listActivity = async (req, res) =>
  res.json(await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(365));

export const logWater = async (req, res) => {
  const { water } = req.validated;
  res.json(
    await Activity.findOneAndUpdate(
      { user: req.user._id, date: new Date().toISOString().slice(0, 10) },
      { $set: { water } },
      { upsert: true, new: true },
    ),
  );
};

export const logWorkout = async (req, res) => {
  const { workoutId } = req.validated;
  const workout = await Workout.findOne({ _id: workoutId, status: 'published' });
  if (!workout) throw fail(404, 'Workout not found.');
  res.json(
    await Activity.findOneAndUpdate(
      { user: req.user._id, date: new Date().toISOString().slice(0, 10) },
      {
        $push: {
          workouts: {
            workout: workout._id.toString(),
            title: workout.title,
            duration: workout.duration,
          },
        },
      },
      { upsert: true, new: true },
    ),
  );
};
