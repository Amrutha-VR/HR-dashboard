import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { DEMO_HR_CREDENTIALS, AUTH_STORAGE_KEY } from '../config/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check storage on mount
  useEffect(() => {
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (session === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email === DEMO_HR_CREDENTIALS.email && password === DEMO_HR_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      throw new Error('Invalid email or password');
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
