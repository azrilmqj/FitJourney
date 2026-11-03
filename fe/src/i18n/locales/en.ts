import { id } from './id';

// English phrases are the translation keys and the default copy.
export const en: Record<string, string> = Object.fromEntries(
  Object.keys(id).map((key) => [key, key]),
);
