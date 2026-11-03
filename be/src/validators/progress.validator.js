import { z } from 'zod';
import { imageUrl, optionalNumber } from './common.js';
export const progressSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (v) =>
        !Number.isNaN(Date.parse(v)) &&
        new Date(v).toISOString().slice(0, 10) === v &&
        v <= new Date().toISOString().slice(0, 10),
      'Enter a valid date, no later than today.',
    ),
  weight: z.number().min(30).max(350),
  bodyFat: optionalNumber(1, 70),
  sleep: optionalNumber(0, 24),
  notes: z.string().max(1000).optional(),
  photo: imageUrl.optional(),
  chest: optionalNumber(10, 300),
  waist: optionalNumber(10, 300),
  hips: optionalNumber(10, 300),
  arms: optionalNumber(5, 150),
  thighs: optionalNumber(5, 150),
});
