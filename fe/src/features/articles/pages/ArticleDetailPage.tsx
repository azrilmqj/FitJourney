import { useLanguage } from '@/hooks/useLanguage';
import { localizedContent } from '@/i18n/localizedContent';
import { ArticleCard } from '@/components/content';
import { LoadState } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import type { Article } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function ArticleDetail() {
  const { t, locale, language } = useLanguage();

  const { slug } = useParams();
  const resource = useResource<Article>(`/articles/${slug}`);
  const related = useResource<Article[]>('/articles');
  const a = resource.data ? localizedContent(resource.data, language) : undefined;
  return (
    <>
      <Link className="back-link" to="/articles">
        <ArrowLeft size={17} />
        {t('Back to the journal')}
      </Link>
      <LoadState {...resource} retry={resource.reload} />
      {a && (
        <>
          <article className="article-detail">
            <span className="pill blue">{t(a.category)}</span>
            <h1>{t(a.title)}</h1>
            <p className="article-excerpt">{t(a.excerpt)}</p>
            <div className="article-meta">
              {a.author}
              <span>·</span>
              {new Date(a.createdAt).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              <span>·</span>
              {a.readTime}
              {t('min read')}
            </div>
            <img className="article-hero" src={a.image} alt={t(a.title)} />
            <div className="prose">
              {a.content.split('\n\n').map((p, i) => (
                <p key={i}>{t(p)}</p>
              ))}
            </div>
          </article>
          <h2 className="spaced-heading">{t('A little more inspiration')}</h2>
          <div className="grid three">
            {related.data
              ?.filter((v) => v._id !== a._id)
              .slice(0, 3)
              .map((v) => (
                <ArticleCard article={v} key={v._id} />
              ))}
          </div>
        </>
      )}
    </>
  );
}
