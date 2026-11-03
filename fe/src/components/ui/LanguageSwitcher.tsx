import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switcher" role="group" aria-label={t('Language')}>
      <Languages size={16} aria-hidden="true" />
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        lang="id"
        aria-label="Bahasa Indonesia"
        aria-pressed={language === 'id'}
        onClick={() => setLanguage('id')}
      >
        ID
      </button>
    </div>
  );
}
