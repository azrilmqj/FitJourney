import { useLanguage } from '@/hooks/useLanguage';
import { Card, Message } from '@/components/ui';
import { adminApi } from '@/services/admin.service';
import type { Article, Workout } from '@/types';
import { useState } from 'react';

type ContentItem = Partial<Omit<Workout, 'translations'>> &
  Partial<Omit<Article, 'translations'>> & {
    translations?: { id?: Record<string, unknown> };
  };

export function ContentForm({
  kind,
  item,
  done,
}: {
  kind: string;
  item?: ContentItem;
  done: () => void;
}) {
  const { t } = useLanguage();

  const video = kind === 'videos';
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Card>
      <h2>
        {t(item ? 'Edit' : 'Create')} {t(video ? 'workout' : 'article')}
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const data: Record<string, unknown> = Object.fromEntries(f);
          const idTranslation: Record<string, unknown> = {};
          const translatedFields = video
            ? ['title', 'description', 'target', 'exercises']
            : ['title', 'excerpt', 'content'];
          for (const field of translatedFields) {
            const value = String(f.get(`id_${field}`) || '').trim();
            delete data[`id_${field}`];
            if (field === 'exercises' && value)
              idTranslation.exercises = value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);
            else if (value) idTranslation[field] = value;
          }
          if (Object.keys(idTranslation).length) data.translations = { id: idTranslation };
          if (video) {
            data.duration = Number(data.duration);
            data.exercises = String(data.exercises)
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
            const raw = String(data.videoId);
            if (raw.startsWith('https://')) {
              try {
                const url = new URL(raw);
                if (!['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname))
                  throw new Error();
                data.videoId =
                  url.hostname === 'youtu.be'
                    ? url.pathname.slice(1)
                    : url.searchParams.get('v') || url.pathname.split('/').at(-1);
              } catch {
                setMessage('Use a valid YouTube URL or an 11-character video ID.');
                return;
              }
            }
          } else data.readTime = Number(data.readTime);
          setBusy(true);
          try {
            await adminApi.saveContent(kind, item?._id, data);
            done();
          } catch (err) {
            setMessage((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {t('Title')}
          <input name="title" required maxLength={200} defaultValue={item?.title} />
        </label>
        <details>
          <summary>{t('Indonesian translation (optional)')}</summary>
          <label>
            {t('Indonesian title')}
            <input
              name="id_title"
              maxLength={200}
              defaultValue={item?.translations?.id?.title as string | undefined}
            />
          </label>
        </details>
        <div className="grid two">
          <label>
            {t('Category')}
            <select name="category" defaultValue={item?.category}>
              {(video
                ? ['Strength', 'Cardio', 'HIIT', 'Flexibility', 'Mobility']
                : ['Nutrition', 'Workout', 'Mindset', 'Recovery', 'Lifestyle']
              ).map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('Status')}
            <select name="status" defaultValue={item?.status || 'draft'}>
              <option value="draft">{t('Draft')}</option>
              <option value="published">{t('Published')}</option>
            </select>
          </label>
        </div>
        <label>
          {t('Image URL')}
          <input name="image" type="url" required pattern="https://.*" defaultValue={item?.image} />
        </label>
        {video ? (
          <>
            <label>
              {t('YouTube URL or video ID')}
              <input name="videoId" required defaultValue={item?.videoId} />
            </label>
            <label>
              {t('Description')}
              <textarea
                name="description"
                required
                maxLength={5000}
                defaultValue={item?.description}
              />
            </label>
            <details>
              <summary>{t('Indonesian workout details')}</summary>
              <label>
                {t('Indonesian description')}
                <textarea
                  name="id_description"
                  maxLength={5000}
                  defaultValue={item?.translations?.id?.description as string | undefined}
                />
              </label>
              <label>
                {t('Indonesian muscle group')}
                <input
                  name="id_target"
                  maxLength={100}
                  defaultValue={item?.translations?.id?.target as string | undefined}
                />
              </label>
              <label>
                {t('Indonesian exercises · one per line')}
                <textarea
                  name="id_exercises"
                  defaultValue={
                    (item?.translations?.id?.exercises as string[] | undefined)?.join('\n')
                  }
                />
              </label>
            </details>
            <div className="grid two">
              <label>
                {t('Trainer')}
                <input name="trainer" required maxLength={80} defaultValue={item?.trainer} />
              </label>
              <label>
                {t('Muscle group')}
                <input name="target" required maxLength={100} defaultValue={item?.target} />
              </label>
              <label>
                {t('Duration (minutes)')}
                <input
                  name="duration"
                  type="number"
                  required
                  min={1}
                  max={180}
                  defaultValue={item?.duration || 20}
                />
              </label>
              <label>
                {t('Level')}
                <select name="level" defaultValue={item?.level}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((v) => (
                    <option key={v} value={v}>
                      {t(v)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              {t('Exercises · one per line')}
              <textarea name="exercises" required defaultValue={item?.exercises?.join('\n')} />
            </label>
          </>
        ) : (
          <>
            <label>
              {t('Slug')}
              <input
                name="slug"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                required
                maxLength={150}
                defaultValue={item?.slug}
                placeholder={t('your-article-title')}
              />
            </label>
            <label>
              {t('Excerpt')}
              <textarea name="excerpt" required maxLength={500} defaultValue={item?.excerpt} />
            </label>
            <label>
              {t('Indonesian excerpt')}
              <textarea
                name="id_excerpt"
                maxLength={500}
                defaultValue={item?.translations?.id?.excerpt as string | undefined}
              />
            </label>
            <label>
              {t('Content')}
              <textarea
                className="editor"
                name="content"
                required
                maxLength={30000}
                defaultValue={item?.content}
              />
            </label>
            <label>
              {t('Indonesian article content')}
              <textarea
                className="editor"
                name="id_content"
                maxLength={30000}
                defaultValue={item?.translations?.id?.content as string | undefined}
              />
            </label>
            <div className="grid two">
              <label>
                {t('Author')}
                <input
                  name="author"
                  required
                  maxLength={80}
                  defaultValue={item?.author || 'FitJourney Editorial'}
                />
              </label>
              <label>
                {t('Reading time (minutes)')}
                <input
                  name="readTime"
                  type="number"
                  required
                  min={1}
                  max={120}
                  defaultValue={item?.readTime || 5}
                />
              </label>
            </div>
          </>
        )}
        <Message text={message} />
        <div className="actions">
          <button disabled={busy} className="primary">
            {t(busy ? 'Saving…' : 'Save content')}
          </button>
          <button type="button" onClick={done}>
            {t('Cancel')}
          </button>
        </div>
      </form>
    </Card>
  );
}
