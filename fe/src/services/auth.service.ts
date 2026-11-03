import type { User } from '@/types';
import { api } from './http';

export const authApi = {
  submit: (mode: string, data: unknown) =>
    api<User & { message: string }>(`/auth/${mode}`, 'POST', data),
  logout: () => api<{ message: string }>('/auth/logout', 'POST'),
};
