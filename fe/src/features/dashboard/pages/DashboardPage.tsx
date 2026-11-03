import { useLanguage } from '@/hooks/useLanguage';
import { WorkoutCard } from '@/components/content';
import { Heading, LoadState, Message } from '@/components/ui';
import { DashboardHero } from '@/features/dashboard/components/DashboardHero';
import { ProgressOverview } from '@/features/dashboard/components/ProgressOverview';
import { TodayActivity } from '@/features/dashboard/components/TodayActivity';
import { WeeklySummary } from '@/features/dashboard/components/WeeklySummary';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';

export function Dashboard() {
  const { t, locale } = useLanguage();

  const {
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
  } = useDashboardData();
  return (
    <>
      <Heading
        title={t(`Hello, ${user?.name.split(' ')[0] || 'there'}!`)}
        subtitle={t('A fresh day. A little stronger. A little more you.')}
        action={
          <div className="date-pill">
            <CalendarDays size={16} />
            {new Date().toLocaleDateString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
            })}
          </div>
        }
      />
      <Message text={message} />
      {!user?.onboarded && (
        <Link className="onboarding-reminder" to="/onboarding">
          {t('Finish your profile to personalize your journey')}
          <ArrowRight size={16} />
        </Link>
      )}
      <div className="dashboard-top">
        <DashboardHero workouts={workouts} />
        <TodayActivity
          minutes={minutes}
          target={target}
          current={current}
          busy={busy}
          setBusy={setBusy}
          setMessage={setMessage}
          activities={activities}
        />
      </div>
      <LoadState
        loading={activities.loading || progress.loading}
        error={activities.error || progress.error}
        retry={() => {
          activities.reload();
          progress.reload();
        }}
      />
      <WeeklySummary completed={completed} week={week} />
      <ProgressOverview progress={progress} latest={latest} target={target} />
      <div className="section-title spaced-heading">
        <div>
          <h2>{t('Find your next feel-good workout')}</h2>
          <p>{t('A little inspiration to get you moving.')}</p>
        </div>
        <Link className="text-link" to="/workouts">
          {t('Explore library')}
          <ArrowRight size={17} />
        </Link>
      </div>
      <LoadState {...workouts} retry={workouts.reload} />
      <div className="grid three">
        {workouts.data?.slice(0, 3).map((w) => (
          <WorkoutCard key={w._id} workout={w} />
        ))}
      </div>
    </>
  );
}
