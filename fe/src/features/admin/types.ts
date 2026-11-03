import type { User } from '@/types';

export interface AdminStats {
  users: number;
  workouts: number;
  articles: number;
  logs: number;
  recentUsers: User[];
  growth: { _id: string; count: number }[];
}
