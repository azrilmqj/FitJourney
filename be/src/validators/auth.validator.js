import { z } from 'zod';
import { credentialPassword, email, password } from './common.js';

export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email, password });
export const loginSchema = z.object({
  email,
  password: credentialPassword,
  remember: z.boolean().optional(),
});
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  password,
});
export const changePasswordSchema = z.object({
  currentPassword: credentialPassword,
  password,
});
export const deleteAccountSchema = z.object({ password: credentialPassword });
