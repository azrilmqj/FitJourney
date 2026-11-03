import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Notifications } from '@/features/notifications/components/Notifications';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Topbar() {
  const { t } = useLanguage();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  return (
    <>
      <header className="topbar">
        <Link className="brand mobile-brand" to="/">
          FitJourney
        </Link>
        <div className="breadcrumb">
          {t(user?.role === 'admin' ? 'Administration' : 'Your space to become better')}{' '}
          <span>✧</span>
        </div>
        <form
          className="global-search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(
              `${user?.role === 'admin' ? '/admin/users' : '/workouts'}?q=${encodeURIComponent(query)}`,
            );
          }}
        >
          <Search size={17} />
          <input
            aria-label={t(user?.role === 'admin' ? 'Search users' : 'Search workouts')}
            placeholder={t(
              user?.role === 'admin' ? 'Search users' : 'Search workouts, inspiration...',
            )}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>↵</kbd>
        </form>
        <LanguageSwitcher />
        {user && <Notifications key={user._id} />}
        <Link className="user-menu" to={user ? '/profile' : '/login'}>
          <Avatar name={user?.name || 'Guest'} image={user?.profile?.avatar} />
          <span>{user?.name.split(' ')[0] || 'Sign in'}</span>
        </Link>
      </header>
    </>
  );
}
