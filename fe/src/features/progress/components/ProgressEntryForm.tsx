import { useLanguage } from '@/hooks/useLanguage';
import { Message } from '@/components/ui';
import { fitnessApi } from '@/services/fitness.service';
import type { Progress } from '@/types';

export function ProgressEntryForm({
  latest,
  busy,
  setBusy,
  message,
  setMessage,
  setModal,
  resource,
}: {
  latest?: Progress;
  busy: boolean;
  setBusy: (value: boolean) => void;
  message: string;
  setMessage: (value: string) => void;
  setModal: (value: boolean) => void;
  resource: { reload: () => void };
}) {
  const { t } = useLanguage();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data: Record<string, unknown> = {};
        new FormData(e.currentTarget).forEach((value, key) => {
          if (value !== '')
            data[key] = ['date', 'notes', 'photo'].includes(key) ? value : Number(value);
        });
        setBusy(true);
        setMessage('');
        try {
          await fitnessApi.createProgress(data);
          resource.reload();
          setModal(false);
          setMessage('Check-in saved. Every small step counts.');
        } catch (err) {
          setMessage((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid two">
        <label>
          {t('Date')}
          <input
            type="date"
            name="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            max={new Date().toISOString().slice(0, 10)}
            required
          />
        </label>
        <label>
          {t('Weight (kg)')}
          <input
            type="number"
            name="weight"
            min={30}
            max={350}
            step="0.1"
            defaultValue={latest?.weight}
            required
          />
        </label>
        <label>
          {t('Body fat (%) · optional')}
          <input type="number" name="bodyFat" min={1} max={70} step="0.1" />
        </label>
        <label>
          {t('Sleep (hours) · optional')}
          <input type="number" name="sleep" min={0} max={24} step="0.1" />
        </label>
      </div>
      <details>
        <summary>{t('Body measurements (optional)')}</summary>
        <div className="grid two">
          {['chest', 'waist', 'hips', 'arms', 'thighs'].map((k) => (
            <label key={k}>
              {k}
              {t('(cm)')}
              <input
                type="number"
                name={k}
                min={10}
                max={k === 'arms' || k === 'thighs' ? 150 : 300}
                step="0.1"
              />
            </label>
          ))}
        </div>
      </details>
      <label>
        {t('Notes')}
        <textarea name="notes" maxLength={1000} placeholder={t('How are you feeling today?')} />
      </label>
      <label>
        {t('Photo URL · optional')}
        <input type="url" name="photo" pattern="https://.*" placeholder={t('https://…')} />
      </label>
      <Message text={message} />
      <button disabled={busy} className="primary full">
        {t(busy ? 'Saving…' : 'Save check-in')}
      </button>
    </form>
  );
}
