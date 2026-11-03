import { useLanguage } from '@/hooks/useLanguage';
import { localizedContent } from '@/i18n/localizedContent';
import { Card, Empty, LoadState, Message, Modal } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import { adminApi } from '@/services/admin.service';
import type { Article, Workout } from '@/types';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ContentForm } from '@/features/admin/components/ContentForm';

export function ContentAdmin({ kind }: { kind: string }) {
  const { t, language } = useLanguage();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const bits = pathname.split('/');
  const isForm = bits.length > 3;
  const id = bits[3];
  const resource = useResource<(Workout | Article)[]>(`/admin/${kind}`);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  if (isForm) {
    const item = resource.data?.find((i) => i._id === id);
    if (id !== 'create' && !resource.data)
      return <LoadState {...resource} retry={resource.reload} />;
    if (id !== 'create' && !item)
      return (
        <Empty
          title={t('Content not found')}
          description={t('Return to the content list and try again.')}
        />
      );
    return <ContentForm kind={kind} item={item} done={() => navigate(`/admin/${kind}`)} />;
  }
  return (
    <Card>
      <div className="section-title">
        <h2>{t(kind === 'videos' ? 'Workout library' : 'Journal articles')}</h2>
        <Link className="button primary" to={`/admin/${kind}/create`}>
          <Plus size={17} />
          {t('Add')} {t(kind === 'videos' ? 'workout' : 'article')}
        </Link>
      </div>
      <LoadState {...resource} retry={resource.reload} />
      <Message text={message} />
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t('Title')}</th>
              <th>{t('Category')}</th>
              <th>{t('Status')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {resource.data?.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="table-title">
                    <img src={item.image} alt={t('')} />
                    {t(localizedContent(item, language).title)}
                  </div>
                </td>
                <td>{t(item.category)}</td>
                <td>
                  <span className={`pill ${item.status === 'published' ? 'green' : 'peach'}`}>
                    {t(item.status)}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <Link
                      className="icon-button"
                      aria-label={t(`Edit ${localizedContent(item, language).title}`)}
                      to={`/admin/${kind}/${item._id}/edit`}
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      className="icon-button danger-text"
                      aria-label={t(`Delete ${localizedContent(item, language).title}`)}
                      onClick={() => setDeleting(item._id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {resource.data?.length === 0 && (
        <Empty
          title={t('Ready for something new?')}
          description={t('Add your first piece of content.')}
        />
      )}
      {deleting && (
        <Modal
          title={t('Delete this content?')}
          close={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <p>{t('This action permanently removes the selected content.')}</p>
          <button
            className="danger"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await adminApi.deleteContent(kind, deleting);
                resource.reload();
                setDeleting(null);
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {t('Delete content')}
          </button>
          <Message text={message} />
        </Modal>
      )}
    </Card>
  );
}
