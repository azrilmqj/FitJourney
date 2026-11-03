import { useLanguage } from '@/hooks/useLanguage';
import { Card, Empty, LoadState } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import type { Progress } from '@/types';

export function ProgressAdmin() {
  const { t } = useLanguage();

  const r = useResource<Progress[]>('/admin/progress');
  return (
    <Card>
      <h2>{t('Progress logs')}</h2>
      <LoadState {...r} retry={r.reload} />
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t('Member')}</th>
              <th>{t('Date')}</th>
              <th>{t('Weight')}</th>
              <th>{t('Notes')}</th>
            </tr>
          </thead>
          <tbody>
            {r.data?.map((p) => (
              <tr key={p._id}>
                <td>{p.user?.name || 'Deleted member'}</td>
                <td>{p.date}</td>
                <td>
                  {p.weight}
                  {t('kg')}
                </td>
                <td>{p.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {r.data?.length === 0 && <Empty />}
    </Card>
  );
}
