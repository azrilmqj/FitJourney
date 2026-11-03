import { useLanguage } from '@/hooks/useLanguage';
import { Card, Heading, Message, Tabs } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { fitnessApi } from '@/services/fitness.service';
import type { Target } from '@/types';
import { ArrowRight, Check, Droplets, Flame, Info, Leaf, Utensils } from 'lucide-react';
import { useState } from 'react';

export function Nutrition() {
  const { t, locale } = useLanguage();

  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('Calculator');
  const [result, setResult] = useState<Target | null>(user?.target || null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [values, setValues] = useState({
    gender: user?.profile?.gender || 'female',
    age: user?.profile?.age || 28,
    height: user?.profile?.height || 165,
    weight: user?.profile?.weight || 60,
    activity: user?.profile?.activity || 1.55,
    goal: user?.profile?.goal || 'maintain',
  });
  const [calculatedValues, setCalculatedValues] = useState<typeof values | null>(null);
  async function calculate(save = false) {
    setBusy(true);
    setMessage('');
    try {
      const target = await (save
        ? fitnessApi.saveNutrition(calculatedValues)
        : fitnessApi.calculateNutrition(values));
      setResult(target);
      if (save) {
        setUser({ ...user!, target });
        setMessage('Your daily targets have been saved.');
      } else setCalculatedValues({ ...values });
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const displayed = tab === 'My Plan' ? user?.target : result;
  return (
    <>
      <Heading
        title={t('Nutrition Calculator')}
        subtitle={t('Find your balance. Fuel your potential.')}
      />
      <Tabs values={['Calculator', 'My Plan']} value={tab} onChange={setTab} />
      <div className="nutrition-layout">
        {tab === 'Calculator' && (
          <Card>
            <span className="eyebrow">{t('LET’S MAKE IT PERSONAL')}</span>
            <h2>{t('Your information')}</h2>
            <p>{t('A few details to help estimate your daily needs.')}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void calculate();
              }}
            >
              <label>
                {t('Sex used for calculation')}
                <select
                  value={values.gender}
                  onChange={(e) => setValues({ ...values, gender: e.target.value })}
                >
                  <option value="female">{t('Female')}</option>
                  <option value="male">{t('Male')}</option>
                </select>
              </label>
              <div className="grid three">
                {(['age', 'height', 'weight'] as const).map((k) => (
                  <label key={k}>
                    {t(k === 'age' ? 'Age' : k === 'height' ? 'Height (cm)' : 'Weight (kg)')}
                    <input
                      type="number"
                      required
                      min={k === 'age' ? 18 : k === 'height' ? 100 : 30}
                      max={k === 'age' ? 100 : k === 'height' ? 250 : 350}
                      step={k === 'age' ? 1 : 0.1}
                      value={values[k]}
                      onChange={(e) => setValues({ ...values, [k]: Number(e.target.value) })}
                    />
                  </label>
                ))}
              </div>
              <label>
                {t('Activity level')}
                <select
                  value={values.activity}
                  onChange={(e) => setValues({ ...values, activity: Number(e.target.value) })}
                >
                  <option value={1.2}>{t('Sedentary · little exercise')}</option>
                  <option value={1.375}>{t('Lightly active · 1–3 days / week')}</option>
                  <option value={1.55}>{t('Moderately active · 3–5 days / week')}</option>
                  <option value={1.725}>{t('Very active · 6–7 days / week')}</option>
                </select>
              </label>
              <label>
                {t('Your goal')}
                <select
                  value={values.goal}
                  onChange={(e) => setValues({ ...values, goal: e.target.value })}
                >
                  <option value="lose">{t('Lose weight')}</option>
                  <option value="build">{t('Build muscle')}</option>
                  <option value="maintain">{t('Maintain fitness')}</option>
                  <option value="health">{t('Improve general health')}</option>
                </select>
              </label>
              <button className="primary full" disabled={busy}>
                {t(busy ? 'Calculating…' : 'Calculate my nutrition')}
                <ArrowRight size={17} />
              </button>
            </form>
          </Card>
        )}
        <Card className="nutrition-result">
          <span className="eyebrow">{t('A LITTLE GUIDANCE FOR YOUR DAY')}</span>
          <h2>{t(tab === 'My Plan' ? 'Your saved daily plan' : 'Your daily targets')}</h2>
          <p>{t('Estimated using the Mifflin–St Jeor equation.')}</p>
          <div className="stat-grid">
            {(
              [
                ['calories', 'Calories / day', 'peach', Flame, ''],
                ['protein', 'Protein · 25%', 'green', Utensils, 'g'],
                ['carbs', 'Carbohydrates · 45%', 'blue', Leaf, 'g'],
                ['fat', 'Fats · 30%', 'peach', Droplets, 'g'],
              ] as const
            ).map(([key, label, color, Icon, unit]) => (
              <div className={`stat ${color}`} key={key}>
                <span className="round-icon">
                  <Icon size={22} />
                </span>
                <strong>
                  {displayed?.[key].toLocaleString(locale) || '—'}
                  <small>{t(displayed ? unit : '')}</small>
                </strong>
                <span>{t(label)}</span>
              </div>
            ))}
          </div>
          <div className="info-note">
            <Info size={20} />
            <p>
              {t(
                'These are general estimates for adults, not a medical plan. Individual needs vary; consult a qualified professional for personal guidance.',
              )}
            </p>
          </div>
          {calculatedValues && tab === 'Calculator' && (
            <button className="secondary full" disabled={busy} onClick={() => void calculate(true)}>
              <Check size={16} />
              {t('Save as daily target')}
            </button>
          )}
          {!displayed && (
            <p className="small">
              {t(
                tab === 'My Plan'
                  ? 'Calculate and save your targets to create your plan.'
                  : 'Fill in your details and calculate to see your targets.',
              )}
            </p>
          )}
          <Message text={message} />
        </Card>
      </div>
    </>
  );
}
