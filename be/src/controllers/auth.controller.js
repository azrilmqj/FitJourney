import * as authService from '../services/auth.service.js';
import {
  cookieOptions,
  createSession,
  revokeSession,
  serializeUser,
} from '../services/session.service.js';

export async function register(req, res) {
  const user = await authService.registerUser(req.validated);
  await createSession(res, user);
  res.status(201).json(serializeUser(user));
}
export async function login(req, res) {
  const { email, password, remember } = req.validated;
  const user = await authService.authenticateUser(email, password);
  await createSession(res, user, remember);
  res.json(serializeUser(user));
}
export async function logout(req, res) {
  await revokeSession(req.cookies.miqora_session);
  res.clearCookie('miqora_session', cookieOptions).json({ message: 'Signed out.' });
}
export async function forgotPassword(req, res) {
  await authService.requestPasswordReset(req.validated.email);
  res.json({ message: 'If that email is registered, a reset link will arrive shortly.' });
}
export async function resetPassword(req, res) {
  await authService.resetUserPassword(req.validated.token, req.validated.password);
  res.json({ message: 'Password updated. Please sign in.' });
}
