import { useLanguage } from '@/hooks/useLanguage';
import { localizedContent } from '@/i18n/localizedContent';
import type { Article } from '@/types';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArticleCard({ article }: { article: Article }) {
  const { t, language } = useLanguage();
  const content = localizedContent(article, language);

  return (
    <Link className="content-card" to={`/articles/${article.slug}`}>
      <div className="image-wrap">
        <img src={content.image} alt={t(content.title)} loading="lazy" />
        <span className="image-category">{t(content.category)}</span>
      </div>
      <div className="content-card-body">
        <h3>{t(content.title)}</h3>
        <p>{t(content.excerpt)}</p>
        <span className="read-time">
          <Clock size={13} />
          {article.readTime}
          {t('min read')}
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
