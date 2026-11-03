import { useLanguage } from '@/hooks/useLanguage';
import { Card, Heading, Message, Modal } from '@/components/ui';
import { PasswordForm } from '@/features/auth/components/PasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/services/user.service';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
export function SettingsPage() {
  const { t } = useLanguage();

  const { user, setUser, logout, authBusy } = useAuth();
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Heading title={t('Settings')} subtitle={t('Make FitJourney feel a little more like you.')} />
      <div className="settings-layout">
        <Card>
          <h2>{t('Notifications')}</h2>
          <p>{t('Choose whether you want to receive email updates.')}</p>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={user?.notifications || false}
              disabled={busy}
              onChange={async (e) => {
                setBusy(true);
                try {
                  setUser(
                    await userApi.updateProfile({
                      name: user!.name,
                      notifications: e.target.checked,
                    }),
                  );
                  setMessage('Notification preference saved.');
                } catch (err) {
                  setMessage((err as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
            {t('Email notifications')}
          </label>
        </Card>
        <PasswordForm />
        <Card>
          <h2>{t('Account')}</h2>
          <p>{t('You control your account and your data.')}</p>
          <div className="actions">
            <button
              disabled={authBusy}
              onClick={() => logout().catch((e) => setMessage(e.message))}
            >
              <LogOut size={17} />
              {t('Sign out')}
            </button>
            {user?.role !== 'admin' && (
              <button className="danger" onClick={() => setConfirm(true)}>
                {t('Delete my account')}
              </button>
            )}
          </div>
          <Message text={message} />
        </Card>
      </div>
      {confirm && (
        <Modal
          title={t('Delete your account?')}
          close={() => {
            if (!busy) setConfirm(false);
          }}
        >
          <p>
            {t(
              'Your profile, sessions, workout history, and progress entries will be permanently deleted. Enter your password to confirm.',
            )}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setBusy(true);
              try {
                await userApi.deleteAccount({ password: f.get('password') });
                window.location.replace('/');
              } catch (err) {
                setMessage((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              {t('Password')}
              <input type="password" name="password" required autoComplete="current-password" />
            </label>
            <Message text={message} />
            <button className="danger" disabled={busy}>
              {t('Permanently delete account')}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
