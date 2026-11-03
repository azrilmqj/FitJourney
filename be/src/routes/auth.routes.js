import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';
const router = Router();
router.post('/register', authLimiter, validateBody(registerSchema), controller.register);
router.post('/login', authLimiter, validateBody(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  controller.forgotPassword,
);
router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  controller.resetPassword,
);
export default router;
