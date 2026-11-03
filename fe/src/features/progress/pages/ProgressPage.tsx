import { useLanguage } from '@/hooks/useLanguage';
import { Card, Empty, Heading, LoadState, Message, Modal, Tabs } from '@/components/ui';
import { Measurements } from '@/features/progress/components/Measurements';
import { ProgressEntryForm } from '@/features/progress/components/ProgressEntryForm';
import { useResource } from '@/hooks/useResource';
import { fitnessApi } from '@/services/fitness.service';
import type { Activity, Progress } from '@/types';
import { Activity as ActivityIcon, Dumbbell, Moon, Plus, Scale, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
export function ProgressPage() {
  const { t } = useLanguage();

  const resource = useResource<Progress[]>('/progress');
  const activities = useResource<Activity[]>('/activity');
  const [tab, setTab] = useState('Weight');
  const [period, setPeriod] = useState('3M');
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState<Progress | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const latest = resource.data?.at(-1);
  const sleepLogs = resource.data?.filter((p) => p.sleep !== undefined) || [];
  const sleep = sleepLogs.length
    ? (sleepLogs.reduce((s, p) => s + p.sleep!, 0) / sleepLogs.length).toFixed(1)
    : '—';
  const workouts =
    activities.data
      ?.filter((a) => a.date.startsWith(new Date().toISOString().slice(0, 7)))
      .reduce((s, a) => s + a.workouts.length, 0) || 0;
  const cutoff = new Date();
  cutoff.setUTCDate(
    cutoff.getUTCDate() - ({ '1W': 7, '1M': 30, '3M': 90, '1Y': 365 }[period] || 90),
  );
  const filtered = resource.data?.filter((p) => p.date >= cutoff.toISOString().slice(0, 10));
  return (
    <>
      <Heading
        title={t('Your Progress')}
        subtitle={t('Small steps create big changes. Look how far you’ve come.')}
        action={
          <button
            className="primary"
            onClick={() => {
              setMessage('');
              setModal(true);
            }}
          >
            <Plus size={17} />
            {t('Add progress')}
          </button>
        }
      />
      <LoadState {...resource} retry={resource.reload} />
      <div className="grid four progress-stats">
        {[
          [Scale, latest?.weight ?? '—', 'kg', 'Current weight', 'blue'],
          [ActivityIcon, latest?.bodyFat ?? '—', '%', 'Body fat', 'green'],
          [Dumbbell, workouts, '', 'Workouts this month', 'peach'],
          [Moon, sleep, 'h', 'Average logged sleep', 'purple'],
        ].map(([Icon, value, unit, label, color]) => {
          const StatIcon = Icon as typeof Scale;
          return (
            <div className={`stat ${color}`} key={label as string}>
              <span className="round-icon">
                <StatIcon size={21} />
              </span>
              <strong>
                {value as string}
                <small> {unit as string}</small>
              </strong>
              <span>{label as string}</span>
            </div>
          );
        })}
      </div>
      <Tabs
        values={['Weight', 'Body Measurement', 'Photos', 'History']}
        value={tab}
        onChange={setTab}
      />
      {tab === 'Weight' && (
        <div className="progress-layout">
          <Card>
            <div className="section-title">
              <div>
                <h2>{t('Weight progress')}</h2>
                <p>{t('Your personal journey, one check-in at a time.')}</p>
              </div>
              <Tabs values={['1W', '1M', '3M', '1Y']} value={period} onChange={setPeriod} />
            </div>
            {filtered?.length ? (
              <div className="large-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filtered}>
                    <defs>
                      <linearGradient id="progress-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#bfe8f5" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#bfe8f5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['dataMin - 2', 'dataMax + 2']}
                      unit=" kg"
                      width={55}
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Area
                      dataKey="weight"
                      type="monotone"
                      stroke="#39a9d0"
                      strokeWidth={2.5}
                      fill="url(#progress-fill)"
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Empty description={t('Add a check-in to see your weight chart for this period.')} />
            )}
          </Card>
          <Measurements latest={latest} />
        </div>
      )}
      {tab === 'Body Measurement' && <Measurements latest={latest} />}
      {t(' ')}
      {tab === 'Photos' && (
        <div className="grid three">
          {resource.data
            ?.filter((p) => p.photo)
            .map((p) => (
              <Card key={p._id}>
                <img className="progress-photo" src={p.photo} alt={t(`Progress on ${p.date}`)} />
                <h3>{p.date}</h3>
                <p>{p.notes}</p>
              </Card>
            ))}
          {!resource.data?.some((p) => p.photo) && (
            <Empty
              title={t('Your story in pictures')}
              description={t('Add an HTTPS photo URL with your next check-in.')}
            />
          )}
        </div>
      )}
      {tab === 'History' && (
        <Card>
          {resource.data?.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{t('Date')}</th>
                    <th>{t('Weight')}</th>
                    <th>{t('Body fat')}</th>
                    <th>{t('Notes')}</th>
                    <th>{t('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...resource.data].reverse().map((p) => (
                    <tr key={p._id}>
                      <td>{p.date}</td>
                      <td>
                        {p.weight}
                        {t('kg')}
                      </td>
                      <td>{p.bodyFat ?? '—'}%</td>
                      <td>{p.notes || '—'}</td>
                      <td>
                        <button
                          className="icon-button danger-text"
                          aria-label={t(`Delete entry ${p.date}`)}
                          onClick={() => setDeleting(p)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </Card>
      )}
      <Message text={!modal ? message : ''} />
      {modal && (
        <Modal
          title={t('A new check-in')}
          close={() => {
            if (!busy) setModal(false);
          }}
        >
          <p>{t('Progress is personal. Capture where you are today.')}</p>
          <ProgressEntryForm
            latest={latest}
            busy={busy}
            setBusy={setBusy}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            resource={resource}
          />
        </Modal>
      )}
      {deleting && (
        <Modal
          title={t('Delete this check-in?')}
          close={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <p>
            {t('The entry from')}
            {deleting.date}
            {t('will be permanently removed.')}
          </p>
          <button
            className="danger"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await fitnessApi.deleteProgress(deleting._id);
                resource.reload();
                setDeleting(null);
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {t('Delete check-in')}
          </button>
          <Message text={message} />
        </Modal>
      )}
    </>
  );
}
