import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { fail } from '../utils/AppError.js';

export function assertEmailConfigured() {
  if (!env.smtp.host)
    throw fail(503, 'Password reset email is not configured. Contact the administrator.');
}

export async function sendPasswordResetEmail(email, token) {
  assertEmailConfigured();
  const transport = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.password } : undefined,
  });
  await transport.sendMail({
    from: env.smtp.from,
    to: email,
    subject: 'Reset your FitJourney password',
    text: `Reset your password within 30 minutes: ${env.appOrigin}/reset-password?token=${token}`,
  });
}
