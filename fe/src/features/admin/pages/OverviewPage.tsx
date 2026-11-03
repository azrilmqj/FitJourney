import { useLanguage } from '@/hooks/useLanguage';
import { Card, LoadState } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import type { AdminStats } from '../types';
import { ChartNoAxesCombined, Dumbbell, FileText, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Overview() {
  const { t, locale } = useLanguage();

  const r = useResource<AdminStats>('/admin/stats');
  return (
    <>
      <LoadState {...r} retry={r.reload} />
      {r.data && (
        <>
          <div className="grid four progress-stats">
            {(
              [
                ['users', 'Total users', Users, 'blue'],
                ['workouts', 'Workout videos', Dumbbell, 'green'],
                ['articles', 'Articles', FileText, 'peach'],
                ['logs', 'Progress logs', ChartNoAxesCombined, 'purple'],
              ] as const
            ).map(([key, label, Icon, color]) => (
              <div key={key} className={`stat ${color}`}>
                <Icon />
                <strong>{r.data![key].toLocaleString(locale)}</strong>
                <span>{t(label)}</span>
              </div>
            ))}
          </div>
          <div className="grid two">
            <Card>
              <h2>{t('New users by month')}</h2>
              <div className="large-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={r.data.growth.map((item) => ({
                      ...item,
                      _id:
                        locale === 'id-ID' && /^\d{4}-\d{2}$/.test(item._id)
                          ? new Date(`${item._id}-01T00:00:00`).toLocaleDateString(locale, {
                              month: 'short',
                              year: 'numeric',
                            })
                          : item._id,
                    }))}
                  >
                    <XAxis dataKey="_id" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a9ddec" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h2>{t('Recent members')}</h2>
              {r.data.recentUsers.map((u) => (
                <div className="measurement-row" key={u._id}>
                  <div>
                    <strong>{u.name}</strong>
                    <p>{u.email}</p>
                  </div>
                  <span>{new Date(u.createdAt).toLocaleDateString(locale)}</span>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
