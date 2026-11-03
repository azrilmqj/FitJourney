import { useLanguage } from '@/hooks/useLanguage';
import { Empty, Heading } from '@/components/ui';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { useLocation } from 'react-router-dom';
import { ContentAdmin } from './ContentPage';
import { Overview } from './OverviewPage';
import { ProgressAdmin } from './ProgressPage';
import { UserAdmin } from './UsersPage';

export function Admin() {
  const { t } = useLanguage();

  const { pathname } = useLocation();
  const part = pathname.split('/')[2] || '';
  return (
    <>
      {part !== 'settings' && (
        <Heading
          title={t(
            part === 'users'
              ? 'Manage users'
              : part === 'videos'
                ? 'Manage workouts'
                : part === 'articles'
                  ? 'Manage articles'
                  : part === 'progress'
                    ? 'Community progress'
                    : 'Admin Dashboard',
          )}
          subtitle={t('A clear view of your FitJourney community.')}
        />
      )}
      {part === '' ? (
        <Overview />
      ) : part === 'users' ? (
        <UserAdmin />
      ) : part === 'progress' ? (
        <ProgressAdmin />
      ) : part === 'settings' ? (
        <SettingsPage />
      ) : ['articles', 'videos'].includes(part) ? (
        <ContentAdmin key={pathname} kind={part} />
      ) : (
        <Empty title={t('Page not found')} description={t('Choose a section above.')} />
      )}
    </>
  );
}
