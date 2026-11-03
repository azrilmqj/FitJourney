import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { Reset, Session, User } from '../models/index.js';
import { fail } from '../utils/AppError.js';
import { assertEmailConfigured, sendPasswordResetEmail } from './email.service.js';
import { hashToken } from './session.service.js';

export function registerUser(data) {
  return bcrypt.hash(data.password, 12).then((password) => User.create({ ...data, password }));
}

export async function authenticateUser(email, password) {
  const user = await User.findOne({ email }).select('+password');
  // Keep password hashing work for unknown emails to reduce account enumeration by timing.
  const valid = await bcrypt.compare(
    password,
    user?.password || '$2b$12$C6UzMDM.H6dfI/f/IKcEe.2OcztD/Gx.b4SXDL1MULOUuTk4wjL1i',
  );
  if (!user || !valid) throw fail(401, 'Email or password is incorrect.');
  return user;
}

export async function requestPasswordReset(email) {
  assertEmailConfigured();
  const user = await User.findOne({ email });
  if (!user) return;
  const token = randomBytes(32).toString('hex');
  await Reset.deleteMany({ user: user._id });
  await Reset.create({
    user: user._id,
    hash: hashToken(token),
    expires: new Date(Date.now() + 30 * 60_000),
  });
  await sendPasswordResetEmail(user.email, token);
}

export async function resetUserPassword(token, password) {
  const reset = await Reset.findOneAndDelete({
    hash: hashToken(token),
    expires: { $gt: new Date() },
  });
  if (!reset) throw fail(400, 'Reset link is invalid or expired.');
  await User.updateOne({ _id: reset.user }, { password: await bcrypt.hash(password, 12) });
  await Session.deleteMany({ user: reset.user });
}
