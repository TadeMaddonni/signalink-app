import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import AuthService from '../../services/auth/AuthService';
import UserService from '../../services/user';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../../types';
import i18n from '../../utils/i18n';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'GUEST_LOGIN' };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        hasCompletedOnboarding: false,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        hasCompletedOnboarding: true,
      };
    case 'GUEST_LOGIN':
      return {
        ...state,
        user: { id: 0, name: 'Guest User', username: 'Guest User', email: 'guest@signalink.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        hasCompletedOnboarding: false, // Guest needs to go through onboarding
      };
    default:
      return state;
  }
};

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  completeOnboarding: () => void;
  loginAsGuest: () => void;
  refreshUser: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load saved user on app start
  useEffect(() => {
    loadSavedUser();
  }, []);

  const loadSavedUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        console.log('👤 Usuario cargado desde AsyncStorage:', user.id, user.name);
        console.log('🧩 Usuario completo desde AsyncStorage:', JSON.stringify(user, null, 2));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        console.log('❌ No hay usuario guardado en AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading saved user:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const user = await AuthService.login(credentials);
      console.log('✅ Login exitoso - Usuario en contexto:', user.id, user.name);
      console.log('🧩 Datos completos de usuario (post-login):', JSON.stringify(user, null, 2));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión. Inténtalo de nuevo.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Validar que las contraseñas coincidan (si confirmPassword está presente)
      if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
        dispatch({ type: 'SET_ERROR', payload: 'Las contraseñas no coinciden' });
        return;
      }

      const user = await AuthService.register(credentials);
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta. Inténtalo de nuevo.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      console.log('👋 Logout - Usuario eliminado del contexto');

      // Reset language to default (English) on logout
      await i18n.changeLanguage('en');
      console.log('🌐 Idioma restablecido a inglés después del logout');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const current = await AuthService.getCurrentUser();
      if (!current?.id) {
        console.warn('⚠️ No hay usuario para refrescar');
        return;
        }
      console.log('🔄 Refrescando usuario desde API para ID:', current.id);
      const updated: User = await UserService.getUserById(current.id);
      console.log('✅ Usuario refrescado:', JSON.stringify(updated, null, 2));
      await AuthService.clearAuthData();
      // Conserva token existente si hay
      const token = await AuthService.getAuthToken();
      if (token) {
        await AsyncStorage.setItem('auth_token', token);
      }
      await AsyncStorage.setItem('user', JSON.stringify(updated));

      // Set i18n language based on updated user preference
      if (updated.language) {
        await i18n.changeLanguage(updated.language);
        console.log('🌐 Idioma configurado desde refreshUser:', updated.language);
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: updated });
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const loginAsGuest = () => {
    dispatch({ type: 'GUEST_LOGIN' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    completeOnboarding,
    loginAsGuest,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
