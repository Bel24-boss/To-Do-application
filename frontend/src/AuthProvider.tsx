import { useEffect, useState } from 'react';

import api, {
  AUTH_EXPIRED_EVENT,
  clearStoredToken,
  getStoredToken,
  storeToken,
} from './api';
import { AuthContext } from './auth-context';
import type { ProtectedResponse, UserSummary } from './types';

interface AuthProviderProps {
  children: React.ReactNode;
}

const initialToken = getStoredToken();

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(Boolean(initialToken));

  useEffect(() => {
    const handleAuthExpired = () => {
      clearStoredToken();
      setToken(null);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    if (!token) {
      return () => {
        window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
      };
    }

    let isActive = true;

    const verifySession = async () => {
      setLoading(true);

      try {
        const response = await api.get<ProtectedResponse>('/protected');
        if (isActive) {
          setUser(response.data.user);
        }
      } catch {
        if (isActive) {
          clearStoredToken();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void verifySession();

    return () => {
      isActive = false;
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, [token]);

  const login = (nextToken: string) => {
    storeToken(nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
