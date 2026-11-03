import { Router } from 'express';
import * as controller from '../controllers/admin.controller.js';
import { articleContent, workoutContent } from '../controllers/adminContent.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { validateBody, validateObjectId } from '../middleware/validate.middleware.js';
import { roleSchema } from '../validators/admin.validator.js';
import { articleSchema } from '../validators/article.validator.js';
import { workoutSchema } from '../validators/workout.validator.js';
const router = Router();
router.use(requireAuth);
router.use(requireAdmin);
router.get('/stats', controller.getStats);
router.get('/users', controller.listUsers);
router.patch('/users/:id', validateObjectId, validateBody(roleSchema), controller.updateUserRole);
router.delete('/users/:id', validateObjectId, controller.deleteUser);
router.get('/progress', controller.listAllProgress);
for (const [path, controller, schema] of [
  ['videos', workoutContent, workoutSchema],
  ['articles', articleContent, articleSchema],
]) {
  router.get('/' + path, controller.list);
  router.get('/' + path + '/:id', validateObjectId, controller.get);
  router.post('/' + path, validateBody(schema), controller.create);
  router.put('/' + path + '/:id', validateObjectId, validateBody(schema), controller.update);
  router.delete('/' + path + '/:id', validateObjectId, controller.remove);
}
export default router;
