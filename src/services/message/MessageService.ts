import { MESSAGE_ROUTES } from '../../routes/message.routes';
import { CreateMessagePayload, Message } from '../../types';
import { buildFullUrl, getAuthHeaders } from '../api/config';
import AuthService from '../auth/AuthService';

/**
 * MessageService - Servicio para gestión de mensajes en grupos
 * Sigue principios SOLID:
 * - Single Responsibility: Solo gestiona operaciones de mensajes
 * - Open/Closed: Extensible para nuevos tipos de mensajes sin modificar código existente
 * - Dependency Inversion: Depende de abstracciones (tipos) no de implementaciones concretas
 */
class MessageService {
  private static instance: MessageService;

  /**
   * Singleton pattern para garantizar una única instancia
   */
  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  /**
   * Obtener headers con autenticación
   */
  private async getHeaders(): Promise<HeadersInit> {
    const token = await AuthService.getAuthToken();
    return getAuthHeaders(token || undefined);
  }

  /**
   * Obtener mensajes de un grupo
   * @param groupId - ID del grupo
   * @returns Array de mensajes del grupo
   */
  async getGroupMessages(groupId: number): Promise<Message[]> {
    try {
      const url = buildFullUrl(MESSAGE_ROUTES.GET_GROUP_MESSAGES(groupId));
      const headers = await this.getHeaders();
      
      console.log('Fetching messages from:', url);
      console.log('Headers:', headers);

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('Get messages response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo no encontrado');
        }
        throw new Error('Error al obtener los mensajes del grupo');
      }

      const data = await response.json();
      console.log('Full messages response:', data);
      
      // El backend puede devolver los mensajes directamente o dentro de una propiedad
      let messages: Message[];
      
      if (data.messages && Array.isArray(data.messages)) {
        // Formato: { messages: [...] }
        messages = data.messages;
      } else if (Array.isArray(data)) {
        // Formato: array directamente
        messages = data;
      } else {
        console.error('Unexpected response format:', data);
        messages = [];
      }
      
      console.log('Messages received:', messages.length);
      
      return messages;
    } catch (error) {
      console.error('Error in getGroupMessages:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Crear un nuevo mensaje en un grupo
   * @param groupId - ID del grupo
   * @param text - Contenido del mensaje
   * @param type - Tipo de mensaje (por defecto 'text')
   * @returns Mensaje creado
   */
  async createMessage(
    groupId: number,
    text: string,
    type: string = 'text'
  ): Promise<Message> {
    try {
      const url = buildFullUrl(MESSAGE_ROUTES.CREATE_GROUP_MESSAGE(groupId));
      const headers = await this.getHeaders();
      
      const payload: CreateMessagePayload = {
        text,
        type,
      };

      console.log('Creating message:', { url, payload });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      console.log('Create message response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión de nuevo.');
        }
        if (response.status === 404) {
          throw new Error('Grupo no encontrado');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos para el mensaje');
        }
        throw new Error('Error al crear el mensaje');
      }

      const data = await response.json();
      console.log('Full response data:', data);
      
      // El backend puede devolver el mensaje directamente o dentro de una propiedad
      // Intentar diferentes formatos de respuesta
      let message: Message;
      
      if (data.message) {
        // Formato: { message: {...} }
        message = data.message;
      } else if (data.id) {
        // Formato: mensaje directamente
        message = data;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Formato de respuesta inesperado del servidor');
      }
      
      console.log('Message created:', message);
      
      return message;
    } catch (error) {
      console.error('Error in createMessage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Crear un mensaje de audio en un grupo
   * @param groupId - ID del grupo
   * @param text - Transcripción del audio
   * @param audioUrl - URL del archivo de audio (opcional)
   * @param duration - Duración del audio en segundos (opcional)
   * @returns Mensaje creado
   */
  async createAudioMessage(
    groupId: number,
    text: string,
    audioUrl?: string,
    duration?: number
  ): Promise<Message> {
    // Por ahora, solo enviamos el texto y type='audio'
    // En el futuro se podría extender para incluir audioUrl y duration en el payload
    console.log('Creating audio message:', { groupId, text, audioUrl, duration });
    return this.createMessage(groupId, text, 'audio');
  }
}

export default MessageService;
