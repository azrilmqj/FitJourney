import { useLanguage } from '@/hooks/useLanguage';
import { localizedContent } from '@/i18n/localizedContent';
import type { Workout } from '@/types';
import { ArrowUpRight, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WorkoutCard({ workout }: { workout: Workout }) {
  const { t, language } = useLanguage();
  const content = localizedContent(workout, language);

  return (
    <Link className="content-card workout-card" to={`/workouts/${workout._id}`}>
      <div className="image-wrap">
        <img src={content.image} alt={t(`${content.title} workout`)} loading="lazy" />
        <span className="play">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="duration">
          <Clock size={12} />
          {content.duration}
          {t('min')}
        </span>
        <span className="image-category">{t(content.category)}</span>
      </div>
      <div className="content-card-body">
        <h3>{t(content.title)}</h3>
        <p>
          {t('With')}
          {content.trainer} <span>·</span> {t(content.level)}
        </p>
      </div>
      <ArrowUpRight className="card-arrow" size={18} />
    </Link>
  );
}
