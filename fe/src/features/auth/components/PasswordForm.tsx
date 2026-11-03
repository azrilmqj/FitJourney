import { useLanguage } from '@/hooks/useLanguage';
import { Card, Message } from '@/components/ui';
import { userApi } from '@/services/user.service';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function PasswordForm() {
  const { t } = useLanguage();

  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Card>
      <h2>
        <ShieldCheck size={22} />
        {t('Change password')}
      </h2>
      <p>{t('Use at least 12 characters for your new password.')}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          if (f.get('password') !== f.get('confirm')) {
            setMessage('Passwords do not match.');
            return;
          }
          setBusy(true);
          try {
            const result = await userApi.changePassword({
              currentPassword: f.get('currentPassword'),
              password: f.get('password'),
            });
            setMessage(result.message);
            form.reset();
          } catch (err) {
            setMessage((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {t('Current password')}
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
          />
        </label>
        <label>
          {t('New password')}
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        <label>
          {t('Confirm new password')}
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        <Message text={message} />
        <button className="primary" disabled={busy}>
          {t(busy ? 'Updating…' : 'Update password')}
        </button>
      </form>
    </Card>
  );
}
