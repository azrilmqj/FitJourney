import { api } from '@/services/http';
import { useCallback, useEffect, useState } from 'react';
export function useResource<T>(path: string) {
  const [state, setState] = useState<{
    path: string;
    data: T | null;
    error: string;
    loading: boolean;
  }>({ path, data: null, error: '', loading: true });
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    api<T>(path)
      .then((data) => {
        if (active) setState({ path, data, error: '', loading: false });
      })
      .catch((e) => {
        if (active) setState({ path, data: null, error: e.message, loading: false });
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return state.path === path
    ? { ...state, reload }
    : { data: null, error: '', loading: true, reload };
}
