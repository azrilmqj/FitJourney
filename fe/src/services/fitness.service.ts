import type { Activity, Progress, Target } from '@/types';
import { api } from './http';

export const fitnessApi = {
  calculateNutrition: (data: unknown) => api<Target>('/nutrition/calculate', 'POST', data),
  saveNutrition: (data: unknown) => api<Target>('/nutrition/target', 'PUT', data),
  createProgress: (data: unknown) => api<Progress>('/progress', 'POST', data),
  deleteProgress: (id: string) => api<{ message: string }>(`/progress/${id}`, 'DELETE'),
  logWater: (data: unknown) => api<Activity>('/activity/water', 'POST', data),
  completeWorkout: (data: unknown) => api<Activity>('/activity/workout', 'POST', data),
};
