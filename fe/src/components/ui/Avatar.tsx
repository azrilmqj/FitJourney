import { useLanguage } from '@/hooks/useLanguage';
export function Avatar({ name, image }: { name: string; image?: string }) {
  const { t } = useLanguage();

  return image ? (
    <img className="avatar" src={image} alt={t(name)} />
  ) : (
    <span className="avatar initials">
      {name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')}
    </span>
  );
}
