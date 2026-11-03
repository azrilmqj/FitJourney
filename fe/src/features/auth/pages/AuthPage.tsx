import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { images } from '@/config/images';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { Link } from 'react-router-dom';
const hero = images.hero;
export function AuthPage({ mode }: { mode: string }) {
  const { t } = useLanguage();

  const register = mode === 'register';
  const login = mode === 'login';
  const forgot = mode === 'forgot-password';
  const title = register
    ? 'A new chapter starts here.'
    : login
      ? 'Welcome back.'
      : forgot
        ? 'Let’s get you back in.'
        : 'A fresh start.';
  return (
    <div className="auth-page">
      <div className="auth-form">
        <LanguageSwitcher />
        <Link to="/" className="brand">
          FitJourney<span>●</span>
        </Link>
        <div>
          <span className="eyebrow">{t('MOVE. IMPROVE. BECOME.')}</span>
          <h1>{t(title)}</h1>
          <p>
            {t(
              register
                ? 'Create your account and make a little time for you.'
                : login
                  ? 'Your journey is waiting. Let’s keep moving.'
                  : 'Reset your password securely.',
            )}
          </p>
          <AuthForm mode={mode} />
          <p className="auth-switch">
            {t(
              login
                ? 'New to FitJourney?'
                : register
                  ? 'Already have an account?'
                  : 'Remember your password?',
            )}
            {t(' ')}
            <Link to={login ? '/register' : '/login'}>
              {t(login ? 'Join the journey' : 'Sign in')}
            </Link>
          </p>
        </div>
        <small>{t('One small step today. A stronger you tomorrow.')}</small>
      </div>
      <div className="auth-visual">
        <img src={hero} alt={t('Male athlete training in the gym')} />
        <div>
          <span className="eyebrow">{t('IT’S YOUR TIME')}</span>
          <h2>
            {t('Healthier.')}
            <br />
            {t('Happier.')}
            <br />
            {t('Stronger.')}
            <br />
            <em>{t('You.')}</em>
          </h2>
        </div>
      </div>
    </div>
  );
}
