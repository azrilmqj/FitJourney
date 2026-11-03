import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { changePasswordSchema, deleteAccountSchema } from '../validators/auth.validator.js';
import { profileSchema } from '../validators/user.validator.js';
const router = Router();
router.use(requireAuth);
router.get('/', controller.getProfile);
router.patch('/', validateBody(profileSchema), controller.updateProfile);
router.post(
  '/password',
  authLimiter,
  validateBody(changePasswordSchema),
  controller.changePassword,
);
router.delete('/', authLimiter, validateBody(deleteAccountSchema), controller.deleteAccount);
export default router;
