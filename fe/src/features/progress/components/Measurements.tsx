import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui';
import type { Progress } from '@/types';

export function Measurements({ latest }: { latest?: Progress }) {
  const { t } = useLanguage();

  return (
    <Card>
      <h2>{t('Body measurements')}</h2>
      <p>{t('Your latest recorded measurements.')}</p>
      {(['chest', 'waist', 'hips', 'arms', 'thighs'] as const).map((k) => (
        <div className="measurement-row" key={k}>
          <span>{k}</span>
          <strong>{t(latest?.[k] ? `${latest[k]} cm` : '—')}</strong>
        </div>
      ))}
      <span className="small">{t('Add measurements with your next check-in.')}</span>
    </Card>
  );
}
