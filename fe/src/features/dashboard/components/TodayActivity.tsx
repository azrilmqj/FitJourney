import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle } from '@/components/ui';
import { fitnessApi } from '@/services/fitness.service';
import { ArrowUpRight, Clock, Droplets, Dumbbell, Flame, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardData } from '../hooks/useDashboardData';

export function TodayActivity({
  minutes,
  target,
  current,
  busy,
  setBusy,
  setMessage,
  activities,
}: Pick<
  DashboardData,
  'minutes' | 'target' | 'current' | 'busy' | 'setBusy' | 'setMessage' | 'activities'
>) {
  const { t, locale } = useLanguage();

  return (
    <section className="today-activity">
      <SectionTitle to="/progress">{t('Today’s activity')}</SectionTitle>
      <div className="stat-grid">
        <div className="stat blue">
          <span className="round-icon">
            <Clock size={20} />
          </span>
          <span>{t('Workout time')}</span>
          <strong>
            {minutes}
            <small>{t('min')}</small>
          </strong>
          <span>{t('A little time, well spent')}</span>
        </div>
        <div className="stat peach">
          <span className="round-icon">
            <Flame size={20} />
          </span>
          <span>{t('Daily calorie target')}</span>
          <strong>
            {target?.calories.toLocaleString(locale) || '—'}
            <small>{t('kcal')}</small>
          </strong>
          <Link to="/nutrition">
            {t(target ? 'View nutrition plan' : 'Set your daily target')} <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="stat green">
          <span className="round-icon">
            <Dumbbell size={20} />
          </span>
          <span>{t('Workouts')}</span>
          <strong>
            {current?.workouts.length || 0}
            <small>{t('sessions')}</small>
          </strong>
          <span>{t('Every session counts')}</span>
        </div>
        <div className="stat blue">
          <span className="round-icon">
            <Droplets size={20} />
          </span>
          <span>{t('Water')}</span>
          <strong>
            {current?.water || 0}
            <small>{t('glasses')}</small>
          </strong>
          <button
            className="water-add"
            disabled={busy || (current?.water || 0) >= 30}
            onClick={async () => {
              setBusy(true);
              try {
                await fitnessApi.logWater({
                  water: (current?.water || 0) + 1,
                });
                activities.reload();
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <Plus size={13} />
            {t('Log a glass')}
          </button>
        </div>
      </div>
    </section>
  );
}
