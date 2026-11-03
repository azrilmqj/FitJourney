import { z } from 'zod';
import { imageUrl, text } from './common.js';
const optionalTranslation = (max) => z.string().trim().max(max).optional();
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
  translations: z
    .object({
      id: z
        .object({
          title: optionalTranslation(200),
          description: optionalTranslation(5000),
          target: optionalTranslation(100),
          exercises: z.array(z.string().trim().min(1).max(200)).max(50).optional(),
        })
        .optional(),
    })
    .optional(),
  status: z.enum(['draft', 'published']),
});
