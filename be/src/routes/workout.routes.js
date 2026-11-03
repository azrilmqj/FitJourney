import { Router } from 'express';
import * as controller from '../controllers/workout.controller.js';
import { validateObjectId } from '../middleware/validate.middleware.js';
const router = Router();
router.get('/', controller.listWorkouts);
router.get('/:id', validateObjectId, controller.getWorkout);
export default router;
