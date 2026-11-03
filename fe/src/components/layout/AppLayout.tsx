import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/components/ui';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export function Layout() {
  const { t } = useLanguage();

  const { user } = useAuth();
  const [error, setError] = useState('');
  return (
    <div className={`app-shell ${user?.role === 'admin' ? 'admin-shell' : ''}`}>
      <a className="skip-link" href="#main">
        {t('Skip to content')}
      </a>
      <Sidebar onError={setError} />
      <div className="app-body">
        <Topbar />
        <main id="main">
          <Message text={error} />
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} FitJourney</span>
          <span>
            {t('Move. Improve. Become.')}
            <span className="leaf-mark">✳</span>
          </span>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
