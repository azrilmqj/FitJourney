import rateLimit from 'express-rate-limit';

const options = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
};
export const apiLimiter = rateLimit({ ...options, windowMs: 60_000, limit: 180 });
export const authLimiter = rateLimit({ ...options, windowMs: 15 * 60_000, limit: 30 });
