import mongoose from 'mongoose';
import { fail } from '../utils/AppError.js';

export const validateBody = (schema) => (req, res, next) => {
  req.validated = schema.parse(req.body);
  next();
};

export function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) throw fail(400, 'Invalid record ID.');
  next();
}
