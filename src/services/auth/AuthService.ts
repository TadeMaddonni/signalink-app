import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LoginCredentials,
    RegisterCredentials,
    User
} from '../../types';
import { API_CONFIG, DEFAULT_HEADERS, buildFullUrl } from '../api/config';

class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realizar login del usuario
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(buildFullUrl(API_CONFIG.ROUTES.AUTH.LOGIN), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      // Si la respuesta HTTP no es ok, manejar como error
      if (!response.ok) {
        // Si es un error de la API, puede venir con estructura { error: string }
        if (data && data.error) {
          throw new Error(data.error);
        }
        throw new Error('Error al iniciar sesión');
      }

      // Si la respuesta es exitosa, verificar la estructura
      if (data.success) {
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          username: credentials.username,
        };

        // Guardar información del usuario
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Guardar token si viene en la respuesta
        if (data.token) {
          await AsyncStorage.setItem('auth_token', data.token);
          console.log('✅ Token guardado exitosamente');
        } else {
          console.warn('⚠️ No se recibió token del backend');
        }
        
        return user;
      } else {
        // Si success es false o no existe, manejar como error
        const errorMessage = data.error || data.message || 'Error en la autenticación';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await fetch(buildFullUrl(API_CONFIG.ROUTES.AUTH.REGISTER), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          name: credentials.name,
          surname: credentials.surname,
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      // Si la respuesta HTTP no es ok, manejar como error
      if (!response.ok) {
        // Si es un error de la API, puede venir con estructura { error: string }
        if (data && data.error) {
          throw new Error(data.error);
        }
        throw new Error('Error al registrar usuario');
      }

      // Si la respuesta es exitosa, verificar la estructura
      if (data.success) {
        const user: User = {
          id: data.user_id,
          name: credentials.name,
          surname: credentials.surname,
          username: credentials.username,
          email: credentials.email,
        };

        // Guardar información del usuario
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Guardar token si viene en la respuesta
        if (data.token) {
          await AsyncStorage.setItem('auth_token', data.token);
          console.log('✅ Token guardado exitosamente en registro');
        } else {
          console.warn('⚠️ No se recibió token del backend en registro');
        }
        
        return user;
      } else {
        // Si success es false o no existe, manejar como error
        const errorMessage = data.error || data.message || 'Error en el registro';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Cerrar sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      // Remover datos del usuario y token
      await AsyncStorage.multiRemove(['user', 'auth_token']);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  /**
   * Obtener usuario guardado localmente
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener token de autenticación (si lo usas)
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['user', 'auth_token']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export default AuthService.getInstance();