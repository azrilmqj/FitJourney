import { env } from '../config/env.js';
import { fail } from '../utils/AppError.js';

export function verifyOrigin(req, res, next) {
  if (
    !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
    !env.allowedOrigins.includes(req.get('origin'))
  ) {
    throw fail(403, 'Request origin is not allowed.');
  }
  next();
}
