import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { translate } from '@/i18n/translate';
import type { Language, TranslationParams } from '@/i18n/types';

const storageKey = 'fitjourney.language';
function readLanguage(): Language {
  try {
    return localStorage.getItem(storageKey) === 'id' ? 'id' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === 'id'
        ? 'FitJourney — Bergerak. Berkembang. Jadi lebih baik.'
        : 'FitJourney — Move. Improve. Become.';
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      /* Language still works when storage is unavailable. */
    }
  }, [language]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey) setLanguage(event.newValue === 'id' ? 'id' : 'en');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const value = useMemo(
    () => ({
      language,
      locale: language === 'id' ? ('id-ID' as const) : ('en-GB' as const),
      setLanguage,
      t: (text: string, params?: TranslationParams) => translate(language, text, params),
    }),
    [language],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
