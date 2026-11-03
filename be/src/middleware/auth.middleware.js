import { Session } from '../models/index.js';
import { hashToken } from '../services/session.service.js';
import { fail } from '../utils/AppError.js';

export async function requireAuth(req, res, next) {
  res.set('Cache-Control', 'no-store');
  const token = req.cookies.miqora_session;
  if (!token) throw fail(401, 'Please sign in to continue.');
  const session = await Session.findOne({
    hash: hashToken(token),
    expires: { $gt: new Date() },
  }).populate('user');
  if (!session?.user) throw fail(401, 'Your session has expired. Please sign in.');
  req.user = session.user;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') throw fail(403, 'Administrator access required.');
  next();
}
