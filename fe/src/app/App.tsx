import { LoadState } from '@/components/ui';
import { AuthProvider } from '@/providers/AuthProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={<LoadState loading error="" retry={() => location.reload()} />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
