export type Language = 'en' | 'id';
export type TranslationParams = Record<string, string | number>;
export interface LanguageContextValue {
  language: Language;
  locale: 'en-GB' | 'id-ID';
  setLanguage: (language: Language) => void;
  t: (text: string, params?: TranslationParams) => string;
}
