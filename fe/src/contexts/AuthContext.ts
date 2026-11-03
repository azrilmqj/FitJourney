import type { User } from '@/types';
import { createContext } from 'react';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string;
  authBusy: boolean;
  authenticate: (mode: 'login' | 'register', data: unknown) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
