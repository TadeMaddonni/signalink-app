import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioSocketService } from '../services/api/AudioSocketService';

export interface AudioTranscriptionConfig {
  transmitterId: number;
  receiverId: number;
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: (text: string) => void;
  onTranscriptionError?: (error: string) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

export interface AudioTranscriptionState {
  isRecording: boolean;
  isProcessing: boolean;
  isSocketConnected: boolean;
  transcribedText: string;
  recordingUri: string | null;
  error: string | null;
}

export const useAudioTranscription = (config: AudioTranscriptionConfig) => {
  // Estados
  const [state, setState] = useState<AudioTranscriptionState>({
    isRecording: false,
    isProcessing: false,
    isSocketConnected: false,
    transcribedText: '',
    recordingUri: null,
    error: null,
  });

  // Referencias
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioSocketRef = useRef<AudioSocketService | null>(null);

  // Actualizar estado de forma segura
  const updateState = useCallback((updates: Partial<AudioTranscriptionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Inicializar servicio de audio
  const initializeAudioService = useCallback(async () => {
    try {
      console.log('🎤 Initializing audio transcription service...');
      
      // Configurar permisos de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Conectar al WebSocket de audio
      audioSocketRef.current = AudioSocketService.getInstance();
      const connected = await audioSocketRef.current.connect();
      
      updateState({ isSocketConnected: connected, error: connected ? null : 'Failed to connect to audio service' });
      config.onConnectionStatusChange?.(connected);

      if (connected) {
        console.log('✅ Audio transcription service initialized successfully');
      } else {
        console.error('❌ Failed to initialize audio transcription service');
      }

      return connected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
      console.error('💥 Audio service initialization error:', errorMessage);
      updateState({ error: errorMessage, isSocketConnected: false });
      config.onTranscriptionError?.(errorMessage);
      return false;
    }
  }, [config, updateState]);

  // Iniciar grabación
  const startRecording = useCallback(async () => {
    try {
      if (state.isRecording) {
        console.warn('⚠️ Already recording');
        return false;
      }

      console.log('🎙️ Starting audio recording...');

      // Solicitar permisos
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Se necesitan permisos de micrófono para grabar');
      }

      // Configurar grabación para formato PCM16 compatible con OpenAI
      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 24000, // OpenAI requiere 24kHz
          numberOfChannels: 1, // Mono para OpenAI
          bitRate: 384000, // 24000 * 16 bits
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 24000, // OpenAI requiere 24kHz
          numberOfChannels: 1, // Mono para OpenAI
          bitRate: 384000,
          linearPCMBitDepth: 16, // PCM16
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 384000,
        },
      };

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      
      recordingRef.current = recording;
      updateState({ isRecording: true, error: null });
      
      console.log('✅ Recording started successfully');
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error during recording';
      console.error('💥 Recording error:', errorMessage);
      updateState({ error: errorMessage, isRecording: false });
      config.onTranscriptionError?.(errorMessage);
      return false;
    }
  }, [state.isRecording, updateState, config]);

  // Detener grabación y procesar
  const stopRecording = useCallback(async () => {
    try {
      if (!state.isRecording || !recordingRef.current) {
        console.warn('⚠️ Not currently recording');
        return false;
      }

      console.log('⏹️ Stopping audio recording...');

      // Detener grabación
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      
      updateState({ 
        isRecording: false, 
        recordingUri: uri,
        isProcessing: true,
        transcribedText: 'Procesando audio...'
      });
      
      config.onTranscriptionStart?.();

      console.log('📁 Recording stopped, URI:', uri);
      
      // Procesar el audio
      if (uri) {
        await processAudioFile(uri);
      } else {
        throw new Error('No se pudo obtener el archivo de audio');
      }

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error stopping recording';
      console.error('💥 Stop recording error:', errorMessage);
      updateState({ 
        error: errorMessage, 
        isRecording: false, 
        isProcessing: false,
        transcribedText: ''
      });
      config.onTranscriptionError?.(errorMessage);
      return false;
    }
  }, [state.isRecording, config]);

  // Procesar archivo de audio
  const processAudioFile = useCallback(async (audioUri: string) => {
    try {
      console.log('🔄 Processing audio file for WebSocket transmission...');
      
      if (!audioSocketRef.current || !state.isSocketConnected) {
        throw new Error('Audio WebSocket not connected');
      }

      // Leer el archivo de audio y convertirlo a base64
      console.log('📖 Reading audio file:', audioUri);
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('✅ Audio file read successfully');
      console.log('📊 Base64 audio length:', base64Audio.length);
      console.log('🔍 First 100 chars of base64:', base64Audio.substring(0, 100));
      
      // Validar que el base64 sea válido
      if (!base64Audio || base64Audio.length === 0) {
        throw new Error('Audio file is empty or could not be read');
      }

      // Verificar que sea base64 válido
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64Audio)) {
        console.warn('⚠️ Base64 validation failed, but continuing...');
      }

      // Dividir el audio en chunks más pequeños para mejor transmisión
      const chunkSize = 4096; // 4KB chunks
      const chunks = [];
      
      for (let i = 0; i < base64Audio.length; i += chunkSize) {
        const chunk = base64Audio.slice(i, i + chunkSize);
        chunks.push(chunk);
      }

      console.log(`📦 Prepared ${chunks.length} audio chunks for transmission`);

      // Enviar cada chunk con logging detallado
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`📤 Sending chunk ${i + 1}/${chunks.length}, size: ${chunk.length}`);
        
        // Log del primer chunk para debug
        if (i === 0) {
          console.log('🔍 First chunk preview:', chunk.substring(0, 50) + '...');
        }
        
        const chunkData = {
          chunk: chunk,
          transmitter_id: config.transmitterId,
          receiver_id: config.receiverId,
        };
        
        audioSocketRef.current.sendAudioChunk(chunkData);
        
        // Pausa entre chunks para evitar saturación
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Finalizar grabación y esperar transcripción
      console.log('🏁 All chunks sent, requesting transcription...');
      const transcriptionResult = await audioSocketRef.current.stopRecording({
        transmitter_id: config.transmitterId,
        receiver_id: config.receiverId,
      });

      console.log('🎯 Transcription received:', transcriptionResult);

      // Extraer el texto transcrito
      let transcribedText = '';
      if (transcriptionResult.transcribed_text) {
        transcribedText = transcriptionResult.transcribed_text;
      } else if (transcriptionResult.content) {
        transcribedText = transcriptionResult.content;
      } else if (transcriptionResult.text) {
        transcribedText = transcriptionResult.text;
      } else {
        transcribedText = 'Audio procesado correctamente';
      }

      updateState({ 
        transcribedText, 
        isProcessing: false, 
        error: null 
      });
      
      config.onTranscriptionComplete?.(transcribedText);

      console.log('✅ Audio transcription completed successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing audio';
      console.error('💥 Audio processing error:', errorMessage);
      
      updateState({ 
        error: errorMessage, 
        isProcessing: false,
        transcribedText: ''
      });
      
      config.onTranscriptionError?.(errorMessage);
    }
  }, [state.isSocketConnected, config, updateState]);

  // Limpiar texto transcrito
  const clearTranscription = useCallback(() => {
    updateState({ transcribedText: '', error: null });
  }, [updateState]);

  // Limpiar recursos al desmontar
  const cleanup = useCallback(() => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(console.error);
    }
    if (audioSocketRef.current) {
      audioSocketRef.current.disconnect();
    }
    console.log('🧹 Audio transcription service cleaned up');
  }, []);

  // Inicializar al montar
  useEffect(() => {
    initializeAudioService();
    return cleanup;
  }, [initializeAudioService, cleanup]);

  return {
    // Estado
    ...state,
    
    // Acciones
    startRecording,
    stopRecording,
    clearTranscription,
    initializeAudioService,
    cleanup,
    
    // Helpers
    toggleRecording: state.isRecording ? stopRecording : startRecording,
    canRecord: state.isSocketConnected && !state.isProcessing,
  };
};