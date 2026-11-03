import { cookieOptions, createSession, serializeUser } from '../services/session.service.js';
import {
  changeUserPassword,
  deleteUserData,
  verifyCurrentPassword,
} from '../services/user.service.js';
import { fail } from '../utils/AppError.js';

export function getProfile(req, res) {
  res.json(serializeUser(req.user));
}
export async function updateProfile(req, res) {
  const data = req.validated;
  if (data.profile) data.profile = { ...(req.user.profile?.toObject?.() || {}), ...data.profile };
  Object.assign(req.user, data);
  await req.user.save();
  res.json(serializeUser(req.user));
}
export async function changePassword(req, res) {
  const user = await changeUserPassword(
    req.user._id,
    req.validated.currentPassword,
    req.validated.password,
  );
  await createSession(res, user);
  res.json({ message: 'Password changed. Other sessions have been signed out.' });
}
export async function deleteAccount(req, res) {
  if (req.user.role === 'admin') throw fail(400, 'Administrators cannot delete their own account.');
  await verifyCurrentPassword(req.user._id, req.validated.password);
  await deleteUserData(req.user._id);
  res.clearCookie('miqora_session', cookieOptions).json({ message: 'Account deleted.' });
}
