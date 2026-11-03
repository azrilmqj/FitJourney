import { calculateNutrition } from '../services/nutrition.service.js';

export const calculate = (req, res) => res.json(calculateNutrition(req.validated));

export const saveTarget = async (req, res) => {
  req.user.target = calculateNutrition(req.validated);
  await req.user.save();
  res.json(req.user.target);
};
