import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { Message } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/services/user.service';
import { ArrowRight, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export function Onboarding() {
  const { t } = useLanguage();

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState({
    age: 28,
    gender: 'female',
    height: 165,
    weight: 60,
    goal: 'maintain',
    activity: 1.55,
  });
  return (
    <div className="onboarding">
      <LanguageSwitcher />
      <Link to="/" className="brand">
        FitJourney
      </Link>
      <section className="card">
        <span className="eyebrow">
          {t('YOUR JOURNEY · STEP')}
          {step + 1}
          {t('OF 4')}
        </span>
        <div className="step-progress">
          <div style={{ width: `${(step + 1) * 25}%` }} />
        </div>
        <h1>
          {t(
            [
              'Let’s get to know you.',
              'What are you working toward?',
              'Find your everyday pace.',
              'You’re ready to begin.',
            ][step],
          )}
        </h1>
        <p>{t('Your information helps personalize your experience.')}</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (step < 3) {
              setStep(step + 1);
              return;
            }
            setBusy(true);
            try {
              setUser(
                await userApi.updateProfile({
                  name: user!.name,
                  profile,
                  onboarded: true,
                }),
              );
              navigate('/dashboard');
            } catch (err) {
              setMessage((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {step === 0 && (
            <div className="grid two">
              {(['age', 'height', 'weight'] as const).map((key) => (
                <label key={key}>
                  {t(key === 'height' ? 'Height (cm)' : key === 'weight' ? 'Weight (kg)' : 'Age')}
                  <input
                    type="number"
                    required
                    min={key === 'age' ? 18 : key === 'height' ? 100 : 30}
                    max={key === 'age' ? 100 : key === 'height' ? 250 : 350}
                    step="any"
                    value={profile[key]}
                    onChange={(e) => setProfile({ ...profile, [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
              <label>
                {t('Sex used for calculation')}
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="female">{t('Female')}</option>
                  <option value="male">{t('Male')}</option>
                </select>
              </label>
            </div>
          )}
          {step === 1 && (
            <div className="choice-grid">
              {[
                ['lose', 'Lose weight'],
                ['build', 'Build muscle'],
                ['maintain', 'Maintain fitness'],
                ['health', 'Improve general health'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={profile.goal === value ? 'selected' : ''}
                  onClick={() => setProfile({ ...profile, goal: value })}
                >
                  <Heart />
                  {t(label)}
                  {profile.goal === value && <Check size={18} />}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <label>
              {t('Activity level')}
              <select
                value={profile.activity}
                onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })}
              >
                <option value={1.2}>{t('Sedentary · little exercise')}</option>
                <option value={1.375}>{t('Lightly active · 1–3 days a week')}</option>
                <option value={1.55}>{t('Moderately active · 3–5 days a week')}</option>
                <option value={1.725}>{t('Very active · 6–7 days a week')}</option>
              </select>
            </label>
          )}
          {step === 3 && (
            <div className="empty">
              <span className="round-icon green">
                <Check />
              </span>
              <h3>{t('Small steps. New possibilities.')}</h3>
              <p>
                {t('Your personal fitness space is ready,')}
                {user?.name.split(' ')[0]}.
              </p>
            </div>
          )}
          <Message text={message} />
          <div className="actions">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                {t('Back')}
              </button>
            )}
            <button className="primary" disabled={busy}>
              {t(busy ? 'Saving…' : step === 3 ? 'Start my journey' : 'Continue')}
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
