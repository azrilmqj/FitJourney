import { en } from './locales/en';
import { id } from './locales/id';
import type { Language, TranslationParams } from './types';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = Object.keys(id)
  .filter((key) => key.includes('{{'))
  .map((key) => {
    const names: string[] = [];
    const expression = key
      .split(/(\{\{\w+\}\})/)
      .map((part) => {
        if (part.startsWith('{{')) {
          names.push(part.slice(2, -2));
          return '(.+?)';
        }
        return escapeRegex(part);
      })
      .join('');
    return { key, names, pattern: new RegExp(`^${expression}$`) };
  });

export function translate(language: Language, text: string, params?: TranslationParams): string {
  const dictionary = language === 'id' ? id : en;
  let translated = dictionary[text];
  let values = params;
  if (!translated && language === 'id') {
    for (const template of templates) {
      const match = text.match(template.pattern);
      if (match) {
        translated = dictionary[template.key];
        values = Object.fromEntries(
          template.names.map((name, index) => [
            name,
            ['level', 'category'].includes(name)
              ? dictionary[match[index + 1]] || match[index + 1]
              : match[index + 1],
          ]),
        );
        break;
      }
    }
  }
  return (translated || text).replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) =>
    values?.[name] === undefined ? placeholder : String(values[name]),
  );
}
