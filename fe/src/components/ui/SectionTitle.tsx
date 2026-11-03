import { useLanguage } from '@/hooks/useLanguage';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function SectionTitle({ children, to }: { children: ReactNode; to?: string }) {
  const { t } = useLanguage();

  return (
    <div className="section-title">
      <h2>{children}</h2>
      {to && (
        <Link className="text-link" to={to}>
          {t('View all')}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
