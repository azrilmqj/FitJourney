import { nutritionSchema } from '../validators/nutrition.validator.js';
export function calculateNutrition(input) {
  const data = nutritionSchema.parse(input);
  const bmr =
    10 * data.weight + 6.25 * data.height - 5 * data.age + (data.gender === 'male' ? 5 : -161);
  const adjustment = data.goal === 'lose' ? -300 : data.goal === 'build' ? 250 : 0;
  const calories = Math.round(
    Math.max(data.gender === 'male' ? 1500 : 1200, bmr * data.activity + adjustment),
  );
  return {
    calories,
    protein: Math.round((calories * 0.25) / 4),
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.3) / 9),
  };
}
