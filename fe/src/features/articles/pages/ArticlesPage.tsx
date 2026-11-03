import { useLanguage } from '@/hooks/useLanguage';
import { ArticleCard } from '@/components/content';
import { Empty, Heading, LoadState, Tabs } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import type { Article } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function Articles() {
  const { t } = useLanguage();

  const resource = useResource<Article[]>('/articles');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const filtered = resource.data?.filter(
    (a) =>
      (category === 'All' || category === a.category) &&
      a.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        title={t('The FitJourney Journal')}
        subtitle={t('Learn. Get inspired. Build a healthier you.')}
      />
      <div className="filters">
        <Tabs
          values={['All', 'Nutrition', 'Workout', 'Mindset', 'Recovery', 'Lifestyle']}
          value={category}
          onChange={setCategory}
        />
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label={t('Search articles')}
            placeholder={t('Find your inspiration')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <LoadState {...resource} retry={resource.reload} />
      <div className="grid three">
        {filtered?.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
      {filtered?.length === 0 && (
        <Empty
          title={t('No articles found')}
          description={t('Try another topic or search term.')}
        />
      )}
    </>
  );
}
