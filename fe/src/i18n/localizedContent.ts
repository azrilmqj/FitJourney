import type { Language } from './types';

type Translatable = { translations?: { id?: object } };

export function localizedContent<T extends Translatable>(item: T, language: Language): T {
  if (language !== 'id' || !item.translations?.id) return item;
  const translated = Object.fromEntries(
    Object.entries(item.translations.id).filter(([, value]) => value !== undefined && value !== ''),
  );
  return { ...item, ...translated };
}
