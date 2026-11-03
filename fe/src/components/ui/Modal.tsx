import { useLanguage } from '@/hooks/useLanguage';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const { t } = useLanguage();

  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={t(title)}
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-content">
        <div className="section-title">
          <h2>{t(title)}</h2>
          <button className="icon-button" aria-label={t('Close dialog')} onClick={close}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
