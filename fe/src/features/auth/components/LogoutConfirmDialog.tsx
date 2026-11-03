import { LogOut } from 'lucide-react';
import { Modal } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';

export function LogoutConfirmDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLanguage();
  return (
    <Modal title={t('Sign out of FitJourney?')} close={onCancel}>
      <div className="logout-confirm-symbol">
        <LogOut size={27} />
      </div>
      <p>{t('Your progress is saved. You can sign back in whenever you’re ready.')}</p>
      <div className="actions logout-confirm-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          {t('Stay signed in')}
        </button>
        <button type="button" className="primary" onClick={onConfirm}>
          <LogOut size={16} />
          {t('Yes, sign out')}
        </button>
      </div>
    </Modal>
  );
}
