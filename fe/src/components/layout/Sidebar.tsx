import { useLanguage } from '@/hooks/useLanguage';
import { navigation, adminNavigation } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export function Sidebar({ onError }: { onError: (message: string) => void }) {
  const { t } = useLanguage();

  const { user, logout, authBusy } = useAuth();
  const items = user?.role === 'admin' ? adminNavigation : navigation;
  return (
    <aside className="sidebar">
      <Link className="brand side-brand" to="/">
        FitJourney<span>●</span>
      </Link>
      <nav aria-label={t('Main navigation')}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/admin'} title={t(label)} aria-label={t(label)}>
            <Icon />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="side-bottom">
        <NavLink to="/profile" title={t('Profile')} aria-label={t('Profile')}>
          <User />
        </NavLink>
        <NavLink
          to={user?.role === 'admin' ? '/admin/settings' : '/settings'}
          title={t('Settings')}
          aria-label={t('Settings')}
        >
          <Settings />
        </NavLink>
        {user && (
          <button
            aria-label={t('Log out')}
            title={t('Log out')}
            disabled={authBusy}
            onClick={() => logout().catch((error) => onError(error.message))}
          >
            <LogOut />
          </button>
        )}
      </div>
    </aside>
  );
}
