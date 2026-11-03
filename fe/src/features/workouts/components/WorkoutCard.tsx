import { useLanguage } from '@/hooks/useLanguage';
import type { Workout } from '@/types';
import { ArrowUpRight, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WorkoutCard({ workout }: { workout: Workout }) {
  const { t } = useLanguage();

  return (
    <Link className="content-card workout-card" to={`/workouts/${workout._id}`}>
      <div className="image-wrap">
        <img src={workout.image} alt={t(`${workout.title} workout`)} loading="lazy" />
        <span className="play">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="duration">
          <Clock size={12} />
          {workout.duration}
          {t('min')}
        </span>
        <span className="image-category">{t(workout.category)}</span>
      </div>
      <div className="content-card-body">
        <h3>{t(workout.title)}</h3>
        <p>
          {t('With')}
          {workout.trainer} <span>·</span> {t(workout.level)}
        </p>
      </div>
      <ArrowUpRight className="card-arrow" size={18} />
    </Link>
  );
}
