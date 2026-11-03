import { useLanguage } from '@/hooks/useLanguage';
export function Message({ text }: { text: string }) {
  const { t } = useLanguage();

  return text ? (
    <p role="status" className="message">
      {t(text)}
    </p>
  ) : null;
}
