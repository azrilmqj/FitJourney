import bcrypt from 'bcryptjs';
import { Activity, Progress, Reset, Session, User } from '../models/index.js';
import { fail } from '../utils/AppError.js';

export async function deleteUserData(user) {
  await Promise.all([
    Session.deleteMany({ user }),
    Reset.deleteMany({ user }),
    Progress.deleteMany({ user }),
    Activity.deleteMany({ user }),
  ]);
  await User.deleteOne({ _id: user });
}

export async function verifyCurrentPassword(userId, password) {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw fail(400, 'Current password is incorrect.');
  return user;
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await verifyCurrentPassword(userId, currentPassword);
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  await Session.deleteMany({ user: user._id });
  return user;
}
