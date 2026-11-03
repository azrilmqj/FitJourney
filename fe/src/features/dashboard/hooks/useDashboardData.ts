import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useResource } from '@/hooks/useResource';
import type { Activity, Progress, Workout } from '@/types';
import { useState } from 'react';

export function useDashboardData() {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const activities = useResource<Activity[]>('/activity');
  const progress = useResource<Progress[]>('/progress');
  const workouts = useResource<Workout[]>('/workouts');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const current = activities.data?.find((a) => a.date === today);
  const minutes = current?.workouts.reduce((sum, w) => sum + w.duration, 0) || 0;
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 6 + i);
    const entry = activities.data?.find((a) => a.date === date.toISOString().slice(0, 10));
    return {
      day: date.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }),
      minutes: entry?.workouts.reduce((sum, w) => sum + w.duration, 0) || 0,
    };
  });
  const completed = week.filter((d) => d.minutes > 0).length;
  const latest = progress.data?.at(-1);
  const target = user?.target;

  return {
    user,
    activities,
    progress,
    workouts,
    message,
    busy,
    setBusy,
    setMessage,
    minutes,
    current,
    week,
    completed,
    latest,
    target,
  };
}
export type DashboardData = ReturnType<typeof useDashboardData>;
