import { z } from 'zod';
export const nutritionSchema = z.object({
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female']),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(350),
  activity: z.union([z.literal(1.2), z.literal(1.375), z.literal(1.55), z.literal(1.725)]),
  goal: z.enum(['lose', 'build', 'maintain', 'health']),
});
