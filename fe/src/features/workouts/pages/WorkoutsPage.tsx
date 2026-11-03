import { useLanguage } from '@/hooks/useLanguage';
import { localizedContent } from '@/i18n/localizedContent';
import { WorkoutCard } from '@/components/content';
import { Empty, Heading, LoadState, Tabs } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import type { Workout } from '@/types';
import { Dumbbell, Search } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function Workouts() {
  const { t, language } = useLanguage();

  const resource = useResource<Workout[]>('/workouts');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All levels');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const filtered = resource.data?.filter(
    (w) =>
      (category === 'All' || w.category === category) &&
      (level === 'All levels' || w.level === level) &&
      `${localizedContent(w, language).title} ${w.trainer} ${localizedContent(w, language).target}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        title={t('Workout Library')}
        subtitle={t('Find your rhythm. Move at your own pace.')}
        action={<span className="eyebrow">{t('A LITTLE STRONGER EVERY DAY')}</span>}
      />
      <div className="library-banner blue">
        <div>
          <span className="eyebrow">{t('SHOW UP FOR YOURSELF')}</span>
          <h2>
            {t('Your next good mood')}
            <br />
            {t('starts with a little movement.')}
          </h2>
          <p>{t('Find a workout that meets you where you are.')}</p>
        </div>
        <Dumbbell size={92} strokeWidth={1} />
      </div>
      <div className="filters">
        <Tabs
          values={['All', 'Strength', 'Cardio', 'HIIT', 'Flexibility', 'Mobility']}
          value={category}
          onChange={setCategory}
        />
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label={t('Search workout library')}
            value={query}
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
            placeholder={t('Find your workout')}
          />
        </label>
        <select
          aria-label={t('Difficulty')}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {['All levels', 'Beginner', 'Intermediate', 'Advanced'].map((v) => (
            <option key={v} value={v}>
              {t(v)}
            </option>
          ))}
        </select>
      </div>
      <LoadState {...resource} retry={resource.reload} />
      <div className="grid three">
        {filtered?.map((w) => (
          <WorkoutCard workout={w} key={w._id} />
        ))}
      </div>
      {filtered?.length === 0 && (
        <Empty
          title={t('No workouts found')}
          description={t('Try another category or a different search.')}
        />
      )}
    </>
  );
}
