import { useLanguage } from '@/hooks/useLanguage';
import type { Article } from '@/types';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArticleCard({ article }: { article: Article }) {
  const { t } = useLanguage();

  return (
    <Link className="content-card" to={`/articles/${article.slug}`}>
      <div className="image-wrap">
        <img src={article.image} alt={t(article.title)} loading="lazy" />
        <span className="image-category">{t(article.category)}</span>
      </div>
      <div className="content-card-body">
        <h3>{t(article.title)}</h3>
        <p>{t(article.excerpt)}</p>
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
