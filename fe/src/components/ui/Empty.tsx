import { useLanguage } from '@/hooks/useLanguage';
import { Leaf } from 'lucide-react';
import type { ReactNode } from 'react';

export function Empty({
  title = 'Your journey starts here',
  description = 'Add your first entry to start seeing your progress.',
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="empty">
      <Leaf size={30} />
      <h3>{t(title)}</h3>
      <p>{t(description)}</p>
      {children}
    </div>
  );
}
