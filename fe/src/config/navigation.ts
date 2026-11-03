import { ChartNoAxesCombined, Dumbbell, FileText, House, Users, Utensils } from 'lucide-react';

export const navigation = [
  { to: '/dashboard', icon: House, label: 'Dashboard' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/progress', icon: ChartNoAxesCombined, label: 'Progress' },
  { to: '/articles', icon: FileText, label: 'Articles' },
];

export const adminNavigation = [
  { to: '/admin', icon: House, label: 'Admin Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/videos', icon: Dumbbell, label: 'Workouts' },
  { to: '/admin/articles', icon: FileText, label: 'Articles' },
  { to: '/admin/progress', icon: ChartNoAxesCombined, label: 'Progress logs' },
];
export const homePath = (user: { role: string; onboarded: boolean }) =>
  user.role === 'admin' ? '/admin' : user.onboarded ? '/dashboard' : '/onboarding';
