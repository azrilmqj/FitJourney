import { useLanguage } from '@/hooks/useLanguage';
import { images } from '@/config/images';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardData } from '../hooks/useDashboardData';
export function DashboardHero({ workouts }: Pick<DashboardData, 'workouts'>) {
  const { t } = useLanguage();

  return (
    <section className="dashboard-hero">
      <div className="hero-text">
        <span className="pill">
          <span className="status-dot" />
          {t('YOUR DAILY DOSE OF GOOD')}
        </span>
        <h2>
          {t('Stronger')}
          <br />
          {t('every day.')}
        </h2>
        <p>
          {t('A little movement.')}
          <br />
          {t('A big step toward a better you.')}
        </p>
        <Link
          to={workouts.data?.[0] ? `/workouts/${workouts.data[0]._id}` : '/workouts'}
          className="button primary"
        >
          {t('Let’s move')}
          <ArrowRight size={17} />
        </Link>
        <span className="hero-caption">{t('Your pace. Your progress.')}</span>
      </div>
      <img src={images.hero} alt={t('Male athlete lifting weights in the gym')} />
      <div className="hero-sticker">
        {t('Make time')}
        <br />
        {t('for')}
        <em>{t('you.')}</em>
      </div>
    </section>
  );
}
