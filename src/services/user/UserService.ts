import { User } from '../../types';
import { API_CONFIG, DEFAULT_HEADERS, buildFullUrl } from '../api/config';

class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Buscar usuario por username o email
   */
  async searchUser(identifier: string): Promise<User> {
    try {
      const url = new URL(buildFullUrl(API_CONFIG.ROUTES.USER.SEARCH));
      url.searchParams.append('identifier', identifier);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        }
        if (response.status === 400) {
          throw new Error('Parámetro identifier requerido');
        }
        throw new Error('Error al buscar el usuario');
      }

      const data = await response.json();
      return data as User;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }
}

export default UserService.getInstance();