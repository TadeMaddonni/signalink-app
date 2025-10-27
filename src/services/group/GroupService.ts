import { buildRouteWithParams } from '../../routes';
import { Group, Member } from '../../types';
import { API_CONFIG, buildFullUrl, getAuthHeaders } from '../api/config';
import AuthService from '../auth/AuthService';

class GroupService {
  private static instance: GroupService;

  public static getInstance(): GroupService {
    if (!GroupService.instance) {
      GroupService.instance = new GroupService();
    }
    return GroupService.instance;
  }

  /**
   * Obtener headers con autenticación
   */
  private async getHeaders(): Promise<HeadersInit> {
    const token = await AuthService.getAuthToken();
    return getAuthHeaders(token || undefined);
  }

  /**
   * Crear nuevo grupo
   */
  async createGroup(name: string, ownerId: number): Promise<Group> {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(buildFullUrl(API_CONFIG.ROUTES.GROUP.CREATE), {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, owner_id: ownerId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos');
        }
        throw new Error('Error al crear el grupo');
      }

      const data = await response.json();
      return data as Group;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Actualizar nombre del grupo
   */
  async updateGroup(groupId: number, name: string): Promise<Group> {
    try {
      const headers = await this.getHeaders();
      
      const route = buildRouteWithParams(
        API_CONFIG.ROUTES.GROUP.UPDATE,
        { group_id: groupId }
      );

      const response = await fetch(buildFullUrl(route), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo no encontrado');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos');
        }
        throw new Error('Error al actualizar el grupo');
      }

      const data = await response.json();
      return data as Group;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Obtener grupos por owner_id
   */
  async getGroupsByOwner(ownerId: number): Promise<Group[]> {
    try {
      const headers = await this.getHeaders();
      
      const route = buildRouteWithParams(
        API_CONFIG.ROUTES.GROUP.GET_BY_OWNER,
        { owner_id: ownerId }
      );

      const response = await fetch(buildFullUrl(route), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        throw new Error('Error al obtener los grupos');
      }

      const data = await response.json();
      return data as Group[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Obtener miembros de un grupo
   */
  async getGroupMembers(groupId: number): Promise<Member[]> {
    try {
      const headers = await this.getHeaders();
      
      const route = buildRouteWithParams(
        API_CONFIG.ROUTES.GROUP.GET_MEMBERS,
        { group_id: groupId }
      );

      const response = await fetch(buildFullUrl(route), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo no encontrado');
        }
        throw new Error('Error al obtener los miembros del grupo');
      }

      const data = await response.json();
      return data as Member[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Eliminar miembro de un grupo
   */
  async deleteMember(groupId: number, userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await this.getHeaders();
      
      const route = buildRouteWithParams(
        API_CONFIG.ROUTES.GROUP.DELETE_MEMBER,
        { group_id: groupId, user_id: userId }
      );

      const response = await fetch(buildFullUrl(route), {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo o miembro no encontrado');
        }
        throw new Error('Error al eliminar el miembro del grupo');
      }

      const data = await response.json();
      return data as { success: boolean; message: string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Añadir miembro a un grupo
   */
  async addMember(groupId: number, userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await this.getHeaders();
      
      const route = buildRouteWithParams(
        API_CONFIG.ROUTES.GROUP.ADD_MEMBER,
        { group_id: groupId }
      );

      const response = await fetch(buildFullUrl(route), {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo o usuario no encontrado');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Usuario ya es miembro');
        }
        throw new Error('Error al añadir el miembro al grupo');
      }

      const data = await response.json();
      return data as { success: boolean; message: string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }
}

export default GroupService.getInstance();