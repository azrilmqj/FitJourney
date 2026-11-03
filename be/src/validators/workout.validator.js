import { z } from 'zod';
import { imageUrl, text } from './common.js';
export const workoutSchema = z.object({
  title: text(),
  description: text(5000),
  category: z.enum(['Strength', 'Cardio', 'HIIT', 'Flexibility', 'Mobility']),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  duration: z.number().int().min(1).max(180),
  trainer: text(80),
  target: text(100),
  image: imageUrl,
  videoId: z.string().regex(/^[\w-]{11}$/),
  exercises: z.array(text(200)).min(1).max(50),
  status: z.enum(['draft', 'published']),
});
