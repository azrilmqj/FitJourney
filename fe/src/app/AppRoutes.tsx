import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/AppLayout';
import { lazy } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
const Landing = lazy(() =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ default: m.Landing })),
);
const AuthPage = lazy(() =>
  import('@/features/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const Onboarding = lazy(() =>
  import('@/features/auth/pages/OnboardingPage').then((m) => ({ default: m.Onboarding })),
);
const Dashboard = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.Dashboard })),
);
const Workouts = lazy(() =>
  import('@/features/workouts/pages/WorkoutsPage').then((m) => ({ default: m.Workouts })),
);
const WorkoutDetail = lazy(() =>
  import('@/features/workouts/pages/WorkoutDetailPage').then((m) => ({ default: m.WorkoutDetail })),
);
const Articles = lazy(() =>
  import('@/features/articles/pages/ArticlesPage').then((m) => ({ default: m.Articles })),
);
const ArticleDetail = lazy(() =>
  import('@/features/articles/pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetail })),
);
const Nutrition = lazy(() =>
  import('@/features/nutrition/pages/NutritionPage').then((m) => ({ default: m.Nutrition })),
);
const ProgressPage = lazy(() =>
  import('@/features/progress/pages/ProgressPage').then((m) => ({ default: m.ProgressPage })),
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const Admin = lazy(() =>
  import('@/features/admin/pages/AdminPage').then((m) => ({ default: m.Admin })),
);

import { Protected } from './ProtectedRoute';
export function AppRoutes() {
  const { t } = useLanguage();

  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {['login', 'register', 'forgot-password', 'reset-password'].map((mode) => (
        <Route key={mode} path={`/${mode}`} element={<AuthPage key={mode} mode={mode} />} />
      ))}
      <Route element={<Protected />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route element={<Protected />}>
          <Route
            path="/dashboard"
            element={user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Dashboard />}
          />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route element={<Protected admin />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <div className="empty">
              <h1>404</h1>
              <h2>{t('Looks like this workout went missing.')}</h2>
              <Link className="button primary" to="/dashboard">
                {t('Back to Dashboard')}
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
