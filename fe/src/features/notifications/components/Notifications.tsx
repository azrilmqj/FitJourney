import { LoadState, Message, Modal } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';
import { useResource } from '@/hooks/useResource';
import { api } from '@/services/http';
import { Bell, CheckCheck, Dumbbell, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Notice = {
  id: string;
  title: string;
  params: Record<string, string>;
  createdAt: string;
  href: string;
  kind: string;
  read: boolean;
};
export function Notifications() {
  const { t, locale } = useLanguage();
  const resource = useResource<{ notifications: Notice[]; unreadCount: number }>('/notifications');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function markRead() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api('/notifications/read', 'POST');
      resource.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="icon-button notification"
        aria-label={t('Notifications')}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen(true);
          resource.reload();
        }}
      >
        <Bell size={20} />
        {!!resource.data?.unreadCount && (
          <span className="notification-count">
            {resource.data.unreadCount > 9 ? '9+' : resource.data.unreadCount}
          </span>
        )}
      </button>
      {open && (
        <Modal title={t('Notifications')} close={() => setOpen(false)}>
          <div className="notification-toolbar">
            <p>{t('Your latest updates, all in one place.')}</p>
            <button disabled={busy || !resource.data?.unreadCount} onClick={() => void markRead()}>
              <CheckCheck size={16} />
              {t(busy ? 'Saving...' : 'Mark all as read')}
            </button>
          </div>
          <LoadState {...resource} retry={resource.reload} />
          <Message text={error} />
          <div className="notification-list">
            {resource.data?.notifications.map((item) => {
              const Icon =
                item.kind === 'user' ? Users : item.kind === 'article' ? FileText : Dumbbell;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`notification-item ${item.read ? '' : 'unread'}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="notification-symbol">
                    <Icon size={20} />
                  </span>
                  <div>
                    <strong>{t(item.title, item.params)}</strong>
                    <time dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString(locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>
                  {!item.read && <span className="unread-dot" aria-label={t('Unread')} />}
                </Link>
              );
            })}
          </div>
          {resource.data?.notifications.length === 0 && (
            <div className="empty">
              <Bell />
              <h3>{t('You are all caught up')}</h3>
              <p>{t('New updates will appear here.')}</p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
