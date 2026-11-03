import { Article, Progress, User, Workout } from '../models/index.js';
import { deleteUserData as removeUser } from '../services/user.service.js';
import { fail } from '../utils/AppError.js';

export const getStats = async (req, res) => {
  const [users, workouts, articles, logs, recentUsers, growth] = await Promise.all([
    User.countDocuments(),
    Workout.countDocuments(),
    Article.countDocuments(),
    Progress.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5),
    User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);
  res.json({ users, workouts, articles, logs, recentUsers, growth });
};

export const listUsers = async (req, res) =>
  res.json(await User.find().sort({ createdAt: -1 }).limit(500));

export const updateUserRole = async (req, res) => {
  const { role } = req.validated;
  if (req.params.id === req.user.id) throw fail(400, 'You cannot change your own role.');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw fail(404, 'User not found.');
  res.json(user);
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) throw fail(400, 'You cannot delete your own account.');
  const user = await User.findById(req.params.id);
  if (!user) throw fail(404, 'User not found.');
  await removeUser(user._id);
  res.json({ message: 'User deleted.' });
};

export const listAllProgress = async (req, res) =>
  res.json(await Progress.find().populate('user', 'name email').sort({ date: -1 }).limit(500));
