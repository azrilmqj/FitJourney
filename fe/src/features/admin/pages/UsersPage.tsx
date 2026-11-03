import { useLanguage } from '@/hooks/useLanguage';
import { useSearchParams } from 'react-router-dom';
import { Card, LoadState, Message, Modal } from '@/components/ui';
import { useResource } from '@/hooks/useResource';
import { adminApi } from '@/services/admin.service';
import type { User } from '@/types';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function UserAdmin() {
  const { t, locale } = useLanguage();

  const r = useResource<User[]>('/admin/users');
  const [target, setTarget] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const setQuery = (value: string) => setSearchParams(value ? { q: value } : {}, { replace: true });
  return (
    <Card>
      <div className="section-title">
        <h2>{t('Community members')}</h2>
        <input
          aria-label={t('Search members')}
          placeholder={t('Search members…')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <LoadState {...r} retry={r.reload} />
      <Message text={message} />
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Email')}</th>
              <th>{t('Role')}</th>
              <th>{t('Joined')}</th>
              <th>{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {r.data
              ?.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))
              .map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      aria-label={t(`Role for ${u.name}`)}
                      value={u.role}
                      disabled={busy}
                      onChange={async (e) => {
                        setBusy(true);
                        try {
                          await adminApi.updateRole(u._id, {
                            role: e.target.value,
                          });
                          r.reload();
                          setMessage('Role updated.');
                        } catch (err) {
                          setMessage((err as Error).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <option value="user">{t('User')}</option>
                      <option value="admin">{t('Admin')}</option>
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString(locale)}</td>
                  <td>
                    <button
                      className="icon-button danger-text"
                      aria-label={t(`Delete ${u.name}`)}
                      onClick={() => setTarget(u)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {target && (
        <Modal
          title={t(`Delete ${target.name}?`)}
          close={() => {
            if (!busy) setTarget(null);
          }}
        >
          <p>{t('This permanently removes the user and their fitness records.')}</p>
          <button
            className="danger"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await adminApi.deleteUser(target._id);
                r.reload();
                setTarget(null);
                setMessage('User deleted.');
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {t('Delete user')}
          </button>
          <Message text={message} />
        </Modal>
      )}
    </Card>
  );
}
