import { useLanguage } from '@/hooks/useLanguage';
import type { ReactNode } from 'react';

export function Heading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <header className="page-heading">
      <div>
        <h1>{t(title)}</h1>
        <p>{t(subtitle)}</p>
      </div>
      {action}
    </header>
  );
}
