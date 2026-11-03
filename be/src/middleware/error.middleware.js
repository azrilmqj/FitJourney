import { z } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof z.ZodError)
    return res.status(400).json({
      message: err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' '),
    });
  if (err.code === 11000)
    return res.status(409).json({ message: 'This email or slug already exists.' });
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ message: 'Invalid JSON request.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err.message);
  res.status(status).json({
    message:
      status >= 500 && status !== 503
        ? 'An unexpected error occurred. Please try again.'
        : err.message,
  });
}
