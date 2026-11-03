import { useLanguage } from '@/hooks/useLanguage';
import { AlertCircle } from 'lucide-react';

export function LoadState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  const { t } = useLanguage();

  if (loading)
    return (
      <div aria-label={t('Loading content')} className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="error" role="alert">
        <AlertCircle size={20} />
        <p>{t(error)}</p>
        <button onClick={retry}>{t('Try again')}</button>
      </div>
    );
  return null;
}
