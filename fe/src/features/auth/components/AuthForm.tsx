import { useLanguage } from '@/hooks/useLanguage';
import { Message } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/auth.service';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export function AuthForm({ mode }: { mode: string }) {
  const { t } = useLanguage();

  const { authenticate, authBusy } = useAuth();
  const [params] = useSearchParams();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const register = mode === 'register';
  const login = mode === 'login';
  const forgot = mode === 'forgot-password';
  return (
    <form
      aria-busy={busy || authBusy}
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy || authBusy) return;
        setMessage('');
        const form = new FormData(e.currentTarget);
        const pass = String(form.get('password') || '');
        if ((register || (!login && !forgot)) && pass !== form.get('confirm')) {
          setMessage('Passwords do not match.');
          return;
        }
        setBusy(true);
        try {
          const data = {
            name: form.get('name'),
            email: form.get('email'),
            password: pass,
            remember: form.get('remember') === 'on',
            token: params.get('token'),
          };
          if (login || register) {
            await authenticate(login ? 'login' : 'register', data);
          } else {
            const result = await authApi.submit(mode, data);
            setMessage(result.message);
          }
        } catch (err) {
          setMessage((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {register && (
        <label>
          {t('Full name')}
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            placeholder={t('Your full name')}
          />
        </label>
      )}
      {(login || register || forgot) && (
        <label>
          {t('Email address')}
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t('you@example.com')}
          />
        </label>
      )}
      {!forgot && (
        <label>
          {t('Password')}
          <input
            name="password"
            type="password"
            minLength={login ? 1 : 12}
            maxLength={128}
            autoComplete={login ? 'current-password' : 'new-password'}
            required
            placeholder={t(login ? 'Enter your password' : 'At least 12 characters')}
          />
        </label>
      )}
      {!login && !forgot && (
        <label>
          {t('Confirm password')}
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
          />
        </label>
      )}
      {login && (
        <div className="section-title">
          <label className="checkbox">
            <input type="checkbox" name="remember" />
            {t('Remember me')}
          </label>
          <Link className="text-link" to="/forgot-password">
            {t('Forgot password?')}
          </Link>
        </div>
      )}
      <div className={message ? 'auth-feedback' : undefined}>
        <Message text={message} />
      </div>
      <button className="primary full auth-submit" disabled={busy || authBusy}>
        {t(
          busy
            ? 'Please wait…'
            : register
              ? 'Create account'
              : login
                ? 'Sign in'
                : forgot
                  ? 'Send reset link'
                  : 'Reset password',
        )}
        {busy ? <LoaderCircle className="auth-spinner" size={18} /> : <ArrowRight size={18} />}
      </button>
    </form>
  );
}
