import { useLanguage } from '@/hooks/useLanguage';
import { Check, LoaderCircle, LogOut } from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface AuthTransitionState {
  kind: 'login' | 'register' | 'logout';
  phase: 'pending' | 'success';
  name?: string;
}

export function AuthTransition({ state }: { state: AuthTransitionState }) {
  const { t } = useLanguage();

  const dialog = useRef<HTMLDialogElement>(null);
  const success = state.phase === 'success';
  const leaving = state.kind === 'logout';
  useEffect(() => {
    const element = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => {
      element.close();
      previous?.focus();
    };
  }, []);

  const title = success
    ? leaving
      ? 'See you soon.'
      : state.kind === 'register'
        ? 'Your journey starts here.'
        : `Welcome back${state.name ? `, ${state.name}` : ''}.`
    : leaving
      ? 'Signing you out…'
      : state.kind === 'register'
        ? 'Creating your space…'
        : 'Signing you in…';

  return (
    <dialog
      ref={dialog}
      className={`auth-transition ${success ? 'is-success' : ''}`}
      aria-labelledby="auth-transition-title"
      aria-describedby="auth-transition-description"
      onCancel={(event) => event.preventDefault()}
    >
      <span className="auth-transition-brand">
        FitJourney<span>●</span>
      </span>
      <div className="auth-transition-symbol" aria-hidden="true">
        <span className="auth-transition-orbit" />
        {success ? (
          <Check key="check" className="auth-transition-check" size={34} />
        ) : leaving ? (
          <LogOut size={30} />
        ) : (
          <LoaderCircle className="auth-spinner" size={32} />
        )}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        <h2 id="auth-transition-title">{t(title)}</h2>
        <p id="auth-transition-description">
          {t(
            success
              ? leaving
                ? 'You’re safely signed out. Come back stronger.'
                : 'A little stronger. A little more you.'
              : leaving
                ? 'Closing your session securely.'
                : 'Getting everything ready for you.',
          )}
        </p>
      </div>
      <div className="auth-transition-track" aria-hidden="true">
        <span />
      </div>
      <small>{t('Move. Improve. Become.')}</small>
    </dialog>
  );
}
