import { getApiUrl, getAuthHeaders } from '../api/config';

export interface SendMessageRequest {
  transmitter_id: number;
  receiver_id: number;
  content: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: any;
}

export class MessageService {
  private static baseUrl = `${getApiUrl()}/messages`;

  static getBaseUrl(): string {
    return this.baseUrl;
  }

  static async sendTextMessage(
    payload: SendMessageRequest,
    token?: string
  ): Promise<MessageResponse> {
    try {
      console.log('Sending request to:', `${this.baseUrl}/text`);
      console.log('Payload:', payload);
      
      const response = await fetch(`${this.baseUrl}/text`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Obtener el texto de la respuesta primero
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
      }
      
      // Imprimir la response por consola como solicita el usuario
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async getConversation(
    user1Id: number,
    user2Id: number,
    token?: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/conversation/${user1Id}/${user2Id}`,
        {
          method: 'GET',
          headers: getAuthHeaders(token),
        }
      );

      const data = await response.json();
      
      console.log('Conversation Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  }

  static async sendAudioMessage(
    audioUri: string,
    transmitterId: number,
    receiverId: number,
    token?: string
  ): Promise<any> {
    try {
      console.log('Sending audio to:', `${this.baseUrl}/audio`);
      console.log('Audio URI:', audioUri);
      console.log('Transmitter ID:', transmitterId);
      console.log('Receiver ID:', receiverId);

      // Crear FormData para enviar el archivo de audio
      const formData = new FormData();
      
      // Agregar el archivo de audio
      const audioFile = {
        uri: audioUri,
        type: 'audio/m4a', // O el tipo que corresponda
        name: 'audio.m4a',
      } as any;
      
      formData.append('audio', audioFile);
      formData.append('transmitter_id', transmitterId.toString());
      formData.append('receiver_id', receiverId.toString());

      // Headers para multipart/form-data
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`${this.baseUrl}/audio`, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('Audio response status:', response.status);

      // Obtener el texto de la respuesta
      const responseText = await response.text();
      console.log('Audio raw response:', responseText);

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
      }

      console.log('Audio API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error sending audio message:', error);
      throw error;
    }
  }
}