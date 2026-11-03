import { homePath } from '@/config/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { LogoutConfirmDialog } from '@/features/auth/components/LogoutConfirmDialog';
import { AuthTransition } from '@/features/auth/components/AuthTransition';
import type { AuthTransitionState } from '@/features/auth/components/AuthTransition';
import { authApi } from '@/services/auth.service';
import { ApiError } from '@/services/http';
import { userApi } from '@/services/user.service';
import type { User } from '@/types';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transition, setTransition] = useState<AuthTransitionState | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const confirmation = useRef<{
    promise: Promise<void>;
    resolve: () => void;
    reject: (error: unknown) => void;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    userApi
      .getProfile()
      .then((value) => {
        if (active) setUser(value);
      })
      .catch((error) => {
        if (active && !(error instanceof ApiError && error.status === 401)) setError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function runTransition(kind: AuthTransitionState['kind'], request: () => Promise<User | null>) {
    if (inFlight.current) return inFlight.current;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const operation = (async () => {
      setTransition({ kind, phase: 'pending' });
      try {
        const [nextUser] = await Promise.all([request(), wait(300)]);
        setUser(nextUser);
        setError('');
        setTransition({ kind, phase: 'success', name: nextUser?.name.split(' ')[0] });
        await wait(700);
        navigate(nextUser ? homePath(nextUser) : '/login', {
          replace: true,
        });
        await wait(200);
      } finally {
        setTransition(null);
        inFlight.current = null;
      }
    })();
    inFlight.current = operation;
    return operation;
  }

  function authenticate(mode: 'login' | 'register', data: unknown) {
    return runTransition(mode, () => authApi.submit(mode, data));
  }

  function logout() {
    if (confirmation.current) return confirmation.current.promise;
    if (inFlight.current) return inFlight.current;
    let resolve!: () => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    confirmation.current = { promise, resolve, reject };
    setConfirmLogout(true);
    return promise;
  }

  function cancelLogout() {
    setConfirmLogout(false);
    confirmation.current?.resolve();
    confirmation.current = null;
  }

  async function acceptLogout() {
    const pending = confirmation.current;
    if (!pending || inFlight.current) return;
    setConfirmLogout(false);
    try {
      await runTransition('logout', async () => {
        await authApi.logout();
        return null;
      });
      pending.resolve();
    } catch (error) {
      pending.reject(error);
    } finally {
      confirmation.current = null;
    }
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, authBusy: transition !== null, setUser, authenticate, logout }}
    >
      {children}
      {confirmLogout && (
        <LogoutConfirmDialog onCancel={cancelLogout} onConfirm={() => void acceptLogout()} />
      )}
      {transition && <AuthTransition state={transition} />}
    </AuthContext.Provider>
  );
}
