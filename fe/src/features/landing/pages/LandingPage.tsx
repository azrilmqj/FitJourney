import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { homePath } from '@/config/navigation';
import { ArticleCard, WorkoutCard } from '@/components/content';
import { LoadState } from '@/components/ui';
import { images } from '@/config/images';
import { useAuth } from '@/hooks/useAuth';
import { useResource } from '@/hooks/useResource';
import type { Article, Workout } from '@/types';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Dumbbell,
  Heart,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router-dom';
const hero = images.hero;
export function Landing() {
  const { t } = useLanguage();

  const { user } = useAuth();
  const workouts = useResource<Workout[]>('/workouts');
  const articles = useResource<Article[]>('/articles');
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand" to="/">
          FitJourney<span>●</span>
        </Link>
        <nav>
          <LanguageSwitcher />
          <a href="#features">{t('Why FitJourney')}</a>
          <Link to="/workouts">{t('Workouts')}</Link>
          <Link to="/articles">{t('Journal')}</Link>
        </nav>
        <Link className="button primary" to={user ? homePath(user) : '/login'}>
          {t(user ? 'My dashboard' : 'Sign in')}
          <ArrowUpRight size={16} />
        </Link>
      </header>
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            {t('A LITTLE BETTER, EVERY DAY')}
          </span>
          <h1>
            {t('Move better.')}
            <br />
            {t('Live')}
            <em>{t('stronger.')}</em>
          </h1>
          <p>
            {t(
              'Your space to move, find your balance, and become the best version of you. One small step at a time.',
            )}
          </p>
          <div className="actions">
            <Link className="button primary" to={user ? '/dashboard' : '/register'}>
              {t('Start your journey')}
              <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/workouts">
              {t('Explore workouts')}
            </Link>
          </div>
          <div className="hero-proof">
            <div className="mini-icons">
              <Dumbbell />
              <Utensils />
              <Heart />
            </div>
            <span>
              {t('Movement. Nutrition. Mindset.')}
              <br />
              <strong>{t('Everything you need, in one place.')}</strong>
            </span>
          </div>
        </div>
        <div className="landing-visual">
          <img src={hero} alt={t('Male athlete training in the gym')} />
          <span className="handwriting">
            {t('A healthier you')}
            <br />
            {t('starts here.')}
          </span>
          <div className="floating-card">
            <span className="round-icon green">
              <Check />
            </span>
            <div>
              <strong>{t('Progress over perfection')}</strong>
              <small>{t('Every little step counts.')}</small>
            </div>
          </div>
        </div>
      </section>
      <div className="brand-strip">
        <span>{t('YOUR JOURNEY, YOUR PACE')}</span>
        <span>
          {t('Move with purpose')}
          <Dumbbell size={18} />
        </span>
        <span>
          {t('Fuel your potential')}
          <Utensils size={18} />
        </span>
        <span>
          {t('Feel more like you')}
          <Heart size={18} />
        </span>
      </div>
      <section id="features" className="landing-section">
        <span className="eyebrow">{t('MADE FOR YOUR EVERYDAY')}</span>
        <h2>
          {t('A little guidance.')}
          <br />
          {t('A whole lot of possibility.')}
        </h2>
        <div className="grid three">
          {[
            [
              Dumbbell,
              'Move your way',
              'Discover guided workouts for your level, your goals, and your schedule.',
              '/workouts',
              'blue',
            ],
            [
              Utensils,
              'Find your balance',
              'Explore your daily nutrition targets with a simple, personal calculator.',
              '/nutrition',
              'peach',
            ],
            [
              TrendingUp,
              'See how far you’ve come',
              'Keep your progress in one place and celebrate the small wins.',
              '/progress',
              'green',
            ],
          ].map(([Icon, title, description, to, color]) => {
            const FeatureIcon = Icon as typeof Dumbbell;
            return (
              <Link to={to as string} className={`feature-card ${color}`} key={title as string}>
                <FeatureIcon />
                <h3>{title as string}</h3>
                <p>{description as string}</p>
                <ArrowUpRight />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="landing-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">{t('MAKE TIME TO MOVE')}</span>
            <h2>{t('Your next feel-good workout.')}</h2>
          </div>
          <Link to="/workouts" className="text-link">
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
      </section>
      <section className="how-section">
        <div>
          <span className="eyebrow">{t('SIMPLE STEPS. REAL MOMENTUM.')}</span>
          <h2>
            {t('Make room for')}
            <br />
            {t('a healthier you.')}
          </h2>
          <Link to="/register" className="button primary">
            {t('Let’s get started')}
            <ArrowRight size={18} />
          </Link>
        </div>
        <div>
          {[
            [
              '01',
              'Make it personal',
              'Tell us a little about yourself and what you’re working toward.',
            ],
            [
              '02',
              'Find your rhythm',
              'Choose a workout, set your nutrition goals, and start small.',
            ],
            ['03', 'Keep growing', 'Log your progress and build a routine that feels like you.'],
          ].map(([n, title, text]) => (
            <div className="step-row" key={n}>
              <span>{n}</span>
              <div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="landing-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">{t('A FRESH PERSPECTIVE')}</span>
            <h2>{t('A little inspiration for your journey.')}</h2>
          </div>
          <Link className="text-link" to="/articles">
            {t('Read the journal')}
            <ArrowRight size={17} />
          </Link>
        </div>
        <LoadState {...articles} retry={articles.reload} />
        <div className="grid three">
          {articles.data?.slice(0, 3).map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      </section>
      <section className="landing-cta">
        <span className="eyebrow">{t('YOUR NEXT CHAPTER STARTS HERE')}</span>
        <h2>
          {t('Move. Improve.')}
          <em>{t('Become.')}</em>
        </h2>
        <Link to="/register" className="button primary">
          {t('Start your journey')}
          <ArrowRight size={18} />
        </Link>
      </section>
      <footer className="landing-footer">
        <Link to="/" className="brand">
          FitJourney
        </Link>
        <span>{t('A healthier you. A stronger tomorrow.')}</span>
        <span>© {new Date().getFullYear()} FitJourney</span>
      </footer>
    </div>
  );
}
