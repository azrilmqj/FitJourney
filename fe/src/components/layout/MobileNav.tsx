import { useLanguage } from '@/hooks/useLanguage';
import { Message, Modal } from '@/components/ui';
import { navigation, adminNavigation } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function MobileNav() {
  const { t } = useLanguage();

  const { user, logout, authBusy } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const items = user?.role === 'admin' ? adminNavigation : navigation;
  return (
    <>
      <nav className="mobile-nav" aria-label={t('Mobile navigation')}>
        {items.slice(0, 4).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/admin'}>
            <Icon size={20} />
            <span>{t(label)}</span>
          </NavLink>
        ))}
        <button onClick={() => setOpen(true)}>
          <Menu size={20} />
          <span>{t('More')}</span>
        </button>
      </nav>
      {open && (
        <Modal title={t('Your FitJourney')} close={() => setOpen(false)}>
          <div className="menu-list">
            {(user?.role === 'admin'
              ? ['admin/progress', 'profile', 'admin/settings']
              : ['articles', 'profile', 'settings']
            ).map((path) => (
              <Link to={`/${path}`} key={path} onClick={() => setOpen(false)}>
                {t(
                  path.endsWith('settings')
                    ? 'Settings'
                    : path.endsWith('profile')
                      ? 'Profile'
                      : path.endsWith('progress')
                        ? 'Progress logs'
                        : 'Articles',
                )}
              </Link>
            ))}
            {user && (
              <button
                disabled={authBusy}
                onClick={() =>
                  logout()
                    .then(() => {
                      setOpen(false);
                    })
                    .catch((error) => setError(error.message))
                }
              >
                <LogOut size={16} />
                {t('Sign out')}
              </button>
            )}
          </div>
          <Message text={error} />
        </Modal>
      )}
    </>
  );
}
