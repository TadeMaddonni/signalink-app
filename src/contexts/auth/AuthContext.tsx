import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import AuthService from '../../services/auth/AuthService';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../../types';

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
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
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
