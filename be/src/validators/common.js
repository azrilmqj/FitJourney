import { z } from 'zod';
export const credentialPassword = z
  .string()
  .min(1)
  .max(128)
  .refine(
    (value) => Buffer.byteLength(value, 'utf8') <= 72,
    'Password must be at most 72 UTF-8 bytes.',
  );
export const password = credentialPassword.refine(
  (value) => value.length >= 12,
  'Use at least 12 characters.',
);
export const email = z
  .email()
  .max(254)
  .transform((v) => v.toLowerCase());
export const text = (max = 200) => z.string().trim().min(1).max(max);
export const optionalNumber = (min, max) => z.number().min(min).max(max).optional();
export const imageUrl = z.union([
  z.literal(''),
  z
    .url()
    .max(2000)
    .refine((v) => v.startsWith('https://'), 'Use an HTTPS image URL.'),
]);
