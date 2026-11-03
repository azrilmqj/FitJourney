import { createHash, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';
import { Session } from '../models/index.js';

export const hashToken = (token) => createHash('sha256').update(token).digest('hex');
export const cookieOptions = {
  httpOnly: true,
  secure: env.production,
  sameSite: 'lax',
  path: '/api',
};

export async function createSession(res, user, remember = false) {
  const token = randomBytes(32).toString('hex');
  const maxAge = (remember ? 30 : 1) * 24 * 60 * 60 * 1000;
  await Session.create({
    hash: hashToken(token),
    user: user._id,
    expires: new Date(Date.now() + maxAge),
  });
  res.cookie('miqora_session', token, { ...cookieOptions, maxAge });
}

export async function revokeSession(token) {
  if (token) await Session.deleteOne({ hash: hashToken(token) });
}

export function serializeUser(user) {
  const value = user.toObject();
  delete value.password;
  return value;
}
