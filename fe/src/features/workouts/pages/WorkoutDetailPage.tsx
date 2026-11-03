import { useLanguage } from '@/hooks/useLanguage';
import { WorkoutCard } from '@/components/content';
import { Card, Heading, LoadState, Message } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useResource } from '@/hooks/useResource';
import { fitnessApi } from '@/services/fitness.service';
import type { Workout } from '@/types';
import { ArrowLeft, Check, Clock, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function WorkoutDetail() {
  const { id } = useParams();
  return <WorkoutSession key={id} id={id} />;
}

function WorkoutSession({ id }: { id?: string }) {
  const { t } = useLanguage();

  const resource = useResource<Workout>(`/workouts/${id}`);
  const related = useResource<Workout[]>('/workouts');
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const w = resource.data;
  return (
    <>
      <Link className="back-link" to="/workouts">
        <ArrowLeft size={17} />
        {t('Workout library')}
      </Link>
      <LoadState {...resource} retry={resource.reload} />
      {w && (
        <>
          <Heading
            title={t(w.title)}
            subtitle={t(`With ${w.trainer} · ${t(w.level)} · ${t(w.category)}`)}
          />
          <div className="detail-grid">
            <div>
              <iframe
                className="video-player"
                src={`https://www.youtube-nocookie.com/embed/${w.videoId}`}
                title={t(w.title)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <Card>
                <h2>{t('A little time for you')}</h2>
                <p>{t(w.description)}</p>
                <div className="tags">
                  <span>
                    <Clock size={16} />
                    {w.duration}
                    {t('minutes')}
                  </span>
                  <span>
                    <Dumbbell size={16} />
                    {t(w.target)}
                  </span>
                </div>
                <Message text={message} />
                {user ? (
                  <button
                    className="primary"
                    disabled={busy || done}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await fitnessApi.completeWorkout({
                          workoutId: w._id,
                        });
                        setDone(true);
                        setMessage('Workout logged. A little stronger today!');
                      } catch (e) {
                        setMessage((e as Error).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <Check size={17} />
                    {t(done ? 'Workout completed' : busy ? 'Saving…' : 'Mark workout complete')}
                  </button>
                ) : (
                  <Link className="button primary" to="/login">
                    {t('Sign in to track this workout')}
                  </Link>
                )}
              </Card>
            </div>
            <Card>
              <span className="eyebrow">{t('YOUR SESSION')}</span>
              <h2>{t('Let’s break it down')}</h2>
              <ol className="exercise-list">
                {w.exercises.map((item, i) => (
                  <li key={i}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {t(item)}
                  </li>
                ))}
              </ol>
              <p className="small">
                {t('Go at your own pace and take a break when you need one.')}
              </p>
            </Card>
          </div>
          <h2 className="spaced-heading">{t('Keep the momentum going')}</h2>
          <div className="grid three">
            {related.data
              ?.filter((item) => item._id !== w._id)
              .slice(0, 3)
              .map((item) => (
                <WorkoutCard key={item._id} workout={item} />
              ))}
          </div>
        </>
      )}
    </>
  );
}
