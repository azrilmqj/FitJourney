import { LoadState } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export function Protected({ admin = false }: { admin?: boolean }) {
  const { user, loading, error } = useAuth();
  if (loading || error)
    return <LoadState loading={loading} error={error} retry={() => location.reload()} />;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
