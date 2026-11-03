import { Progress } from '../models/index.js';
import { fail } from '../utils/AppError.js';

export const listProgress = async (req, res) =>
  res.json(await Progress.find({ user: req.user._id }).sort({ date: 1, createdAt: 1 }).limit(1000));

export const createProgress = async (req, res) =>
  res.status(201).json(await Progress.create({ ...req.validated, user: req.user._id }));

export const deleteProgress = async (req, res) => {
  const item = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) throw fail(404, 'Progress entry not found.');
  res.json({ message: 'Entry deleted.' });
};
