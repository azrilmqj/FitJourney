import { z } from 'zod';
import { imageUrl, text } from './common.js';
const optionalTranslation = (max) => z.string().trim().max(max).optional();
export const articleSchema = z.object({
  title: text(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: text(500),
  content: text(30000),
  category: z.enum(['Nutrition', 'Workout', 'Mindset', 'Recovery', 'Lifestyle']),
  image: imageUrl,
  author: text(80),
  readTime: z.number().int().min(1).max(120),
  translations: z
    .object({
      id: z
        .object({
          title: optionalTranslation(200),
          excerpt: optionalTranslation(500),
          content: optionalTranslation(30000),
        })
        .optional(),
    })
    .optional(),
  status: z.enum(['draft', 'published']),
});
