import { useState } from 'react';
import AuthService from '../services/auth/AuthService';
import { LoginCredentials, RegisterCredentials, User } from '../types';

interface UseAuthServiceReturn {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  isAuthenticated: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAuthService = (): UseAuthServiceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleAsync = async <T,>(
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    return handleAsync(() => AuthService.login(credentials));
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    return handleAsync(() => AuthService.register(credentials));
  };

  const logout = async (): Promise<void> => {
    return handleAsync(() => AuthService.logout());
  };

  const getCurrentUser = async (): Promise<User | null> => {
    return handleAsync(() => AuthService.getCurrentUser());
  };

  const isAuthenticated = async (): Promise<boolean> => {
    return handleAsync(() => AuthService.isAuthenticated());
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    loading,
    error,
    clearError,
  };
};