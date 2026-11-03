import { User } from '../models/index.js';
import { listNotifications } from '../services/notification.service.js';

export async function getNotifications(req, res) {
  res.json(await listNotifications(req.user));
}

export async function markNotificationsRead(req, res) {
  await User.updateOne({ _id: req.user._id }, { $max: { notificationsReadAt: new Date() } });
  res.json({ message: 'Notifications marked as read.' });
}
