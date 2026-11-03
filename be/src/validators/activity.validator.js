import { z } from 'zod';
export const waterSchema = z.object({ water: z.number().int().min(0).max(30) });
export const completedWorkoutSchema = z.object({ workoutId: z.string().regex(/^[a-f0-9]{24}$/) });
