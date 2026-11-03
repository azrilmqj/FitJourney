import { useLanguage } from '@/hooks/useLanguage';
export function Tabs({
  values,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="tabs">
      {values.map((tab) => (
        <button
          type="button"
          key={tab}
          aria-pressed={value === tab}
          className={value === tab ? 'active' : ''}
          onClick={() => onChange(tab)}
        >
          {t(tab)}
        </button>
      ))}
    </div>
  );
}
