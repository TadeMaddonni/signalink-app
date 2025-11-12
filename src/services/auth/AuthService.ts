import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginCredentials,
  RegisterCredentials,
  User
} from '../../types';
import { API_CONFIG, DEFAULT_HEADERS, buildFullUrl } from '../api/config';
import i18n from '../../utils/i18n';
import UserService from '../user';

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
      console.log('🔐 Iniciando login para:', credentials.username);
      
      const response = await fetch(buildFullUrl(API_CONFIG.ROUTES.AUTH.LOGIN), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', JSON.stringify(data, null, 2));

      // Si la respuesta HTTP no es ok, manejar como error
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status);
        // Si es un error de la API, puede venir con estructura { error: string }
        if (data && data.error) {
          throw new Error(data.error);
        }
        throw new Error('Error al iniciar sesión');
      }

      // Si la respuesta es exitosa, verificar la estructura
      if (data.success) {
        console.log('✅ Login exitoso en backend');
        // Limpiar datos anteriores primero
        await AsyncStorage.multiRemove(['user', 'auth_token']);
        console.log('🧹 Datos de sesión anterior limpiados');

        const baseUserId: number = data.user.id;

        // Guardar token si viene en la respuesta (antes de llamadas subsiguientes)
        if (data.token) {
          await AsyncStorage.setItem('auth_token', data.token);
          console.log('✅ Token guardado exitosamente');
        } else {
          console.warn('⚠️ No se recibió token del backend');
        }

        // Obtener información completa del usuario por ID
        const fullUser: User = await UserService.getUserById(baseUserId);
        console.log('👤 Usuario completo desde API (post-login):', JSON.stringify(fullUser, null, 2));

        // Guardar información completa del usuario
        await AsyncStorage.setItem('user', JSON.stringify(fullUser));
        console.log('💾 Usuario completo guardado en AsyncStorage:', fullUser.id, fullUser.name);

        // Set i18n language based on user preference
        if (fullUser.language) {
          await i18n.changeLanguage(fullUser.language);
          console.log('🌐 Idioma configurado:', fullUser.language);
        }

        return fullUser;
      } else {
        // Si success es false o no existe, manejar como error
        console.error('❌ Success es false o no existe en la respuesta');
        const errorMessage = data.error || data.message || 'Error en la autenticación';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Error en login:', error);
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
      console.log('📝 Iniciando registro para:', credentials.username, 'Tipo:', credentials.user_type);
      
      const response = await fetch(buildFullUrl(API_CONFIG.ROUTES.AUTH.REGISTER), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          name: credentials.name,
          surname: credentials.surname,
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          language: credentials.language,
          user_type: credentials.user_type,
        }),
      });

      // Manejar errores de servidor (503, 502, etc.)
      if (response.status >= 500) {
        console.error('❌ Error del servidor:', response.status);
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error del servidor (${response.status})`);
        }
        throw new Error(`El servidor no está disponible (Error ${response.status}). Por favor intenta más tarde.`);
      }

      let data;
      try {
        data = await response.json();
        console.log('📦 Response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        throw new Error('Respuesta inválida del servidor. Verifica que el backend esté funcionando.');
      }

      // Si la respuesta HTTP no es ok, manejar como error
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status);
        // Si es un error de la API, puede venir con estructura { error: string }
        if (data && data.error) {
          throw new Error(data.error);
        }
        throw new Error('Error al registrar usuario');
      }

      // Si la respuesta es exitosa, verificar la estructura
      if (data.success) {
        console.log('✅ Registro exitoso en backend');
        // Limpiar datos anteriores primero
        await AsyncStorage.multiRemove(['user', 'auth_token']);
        console.log('🧹 Datos de sesión anterior limpiados');

        const baseUserId: number = data.user.id;

        // Guardar token si viene en la respuesta (antes de llamadas subsiguientes)
        if (data.token) {
          await AsyncStorage.setItem('auth_token', data.token);
          console.log('✅ Token guardado exitosamente en registro');
        } else {
          console.warn('⚠️ No se recibió token del backend en registro');
        }

        // Obtener información completa del usuario por ID (igual que en login)
        const fullUser: User = await UserService.getUserById(baseUserId);
        console.log('👤 Usuario completo desde API (post-registro):', JSON.stringify(fullUser, null, 2));

        // Guardar información completa del usuario
        await AsyncStorage.setItem('user', JSON.stringify(fullUser));
        console.log('💾 Usuario completo guardado en AsyncStorage:', fullUser.id, fullUser.name, 'Tipo:', fullUser.user_type);

        // Set i18n language based on user preference
        if (fullUser.language) {
          await i18n.changeLanguage(fullUser.language);
          console.log('🌐 Idioma configurado:', fullUser.language);
        }

        return fullUser;
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
      console.log('🔓 Sesión cerrada - Usuario y token eliminados');
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
        const user = JSON.parse(userData) as User;

        // Set i18n language based on saved user preference
        if (user.language) {
          console.log('🌐 getCurrentUser - Cambiando idioma a:', user.language);
          await i18n.changeLanguage(user.language);
          console.log('🌐 getCurrentUser - Idioma actual después del cambio:', i18n.language);
        } else {
          console.log('⚠️ getCurrentUser - Usuario no tiene campo language:', user);
        }

        return user;
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