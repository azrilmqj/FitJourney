import { z } from 'zod';
import { imageUrl, text } from './common.js';
import { nutritionSchema } from './nutrition.validator.js';
export const profileSchema = z.object({
  name: text(80),
  profile: nutritionSchema
    .partial()
    .extend({
      location: z.string().max(100).optional(),
      dob: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      bio: z.string().max(500).optional(),
      avatar: imageUrl.optional(),
    })
    .optional(),
  onboarded: z.boolean().optional(),
  notifications: z.boolean().optional(),
});
