import { io, Socket } from 'socket.io-client';
import { getApiUrl } from './config';

export interface AudioChunkData {
  chunk: string; // Audio en base64
  transmitter_id: number;
  receiver_id: number;
}

export interface StopRecordingData {
  transmitter_id: number;
  receiver_id: number;
}

export class AudioSocketService {
  private static instance: AudioSocketService;
  private socket: Socket | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): AudioSocketService {
    if (!AudioSocketService.instance) {
      AudioSocketService.instance = new AudioSocketService();
    }
    return AudioSocketService.instance;
  }

  // Conectar al WebSocket
  async connect(): Promise<boolean> {
    try {
      const baseUrl = getApiUrl().replace('/api', ''); // Remover /api para WebSocket
      console.log('Connecting to audio WebSocket:', baseUrl);
      
      this.socket = io(baseUrl, {
        transports: ['websocket'],
        forceNew: true,
      });

      return new Promise((resolve) => {
        if (!this.socket) {
          resolve(false);
          return;
        }

        this.socket.on('connect', () => {
          console.log('Audio WebSocket connected');
          this.isConnected = true;
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Audio WebSocket connection error:', error);
          this.isConnected = false;
          resolve(false);
        });

        this.socket.on('disconnect', () => {
          console.log('Audio WebSocket disconnected');
          this.isConnected = false;
        });

        // Manejar respuestas de transcripción
        this.socket.on('transcription_complete', (data) => {
          console.log('🎯 Global transcription_complete received:', data);
        });

        this.socket.on('transcription_error', (error) => {
          console.error('🔥 Global transcription_error received:', error);
        });

        // Listeners adicionales para debugging
        this.socket.on('error', (error) => {
          console.error('🚨 Socket error:', error);
        });

        this.socket.on('message', (message) => {
          console.log('📨 Socket message:', message);
        });

        // Listener genérico para todos los eventos
        this.socket.onAny((eventName, ...args) => {
          console.log(`🔊 Socket event received: ${eventName}`, args);
        });
      });
    } catch (error) {
      console.error('Failed to connect to audio WebSocket:', error);
      return false;
    }
  }

  // Desconectar del WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Enviar chunk de audio
  sendAudioChunk(data: AudioChunkData): void {
    if (!this.socket || !this.isConnected) {
      throw new Error('Audio WebSocket not connected');
    }

    console.log('📤 Emitting audio_chunk event');
    console.log('Chunk metadata:', {
      transmitter_id: data.transmitter_id,
      receiver_id: data.receiver_id,
      chunkSize: data.chunk.length,
      socketConnected: this.socket.connected
    });
    
    this.socket.emit('audio_chunk', data);
    
    console.log('✅ Audio chunk sent successfully');
  }

  // Finalizar grabación y obtener transcripción
  stopRecording(data: StopRecordingData): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Audio WebSocket not connected'));
        return;
      }

      console.log('🛑 Emitting stop_recording event');
      console.log('Stop recording data:', data);

      // Timeout para la transcripción (30 segundos)
      const timeout = setTimeout(() => {
        this.socket!.off('transcription_complete', handleTranscription);
        this.socket!.off('transcription_error', handleError);
        reject(new Error('Transcription timeout - no response from server'));
      }, 30000);

      // Escuchar la respuesta de transcripción
      const handleTranscription = (transcriptionData: any) => {
        console.log('✅ Received transcription_complete:', transcriptionData);
        clearTimeout(timeout);
        this.socket!.off('transcription_complete', handleTranscription);
        this.socket!.off('transcription_error', handleError);
        resolve(transcriptionData);
      };

      const handleError = (error: any) => {
        console.log('❌ Received transcription_error:', error);
        clearTimeout(timeout);
        this.socket!.off('transcription_complete', handleTranscription);
        this.socket!.off('transcription_error', handleError);
        reject(error);
      };

      // Configurar listeners temporales para esta transcripción
      this.socket.on('transcription_complete', handleTranscription);
      this.socket.on('transcription_error', handleError);

      // Enviar evento de stop recording
      this.socket.emit('stop_recording', data);
      
      console.log('📡 Stop recording event sent, waiting for response...');
    });
  }

  // Verificar si está conectado
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Agregar listener para eventos personalizados
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remover listener
  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}