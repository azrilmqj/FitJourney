import type { User } from '@/types';
import { api } from './http';

export const userApi = {
  getProfile: () => api<User>('/me'),
  updateProfile: (data: unknown) => api<User>('/me', 'PATCH', data),
  changePassword: (data: unknown) => api<{ message: string }>('/me/password', 'POST', data),
  deleteAccount: (data: unknown) => api<{ message: string }>('/me', 'DELETE', data),
};
