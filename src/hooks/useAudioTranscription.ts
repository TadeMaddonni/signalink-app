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

  // Referencias para evitar re-inicializaciones
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioSocketRef = useRef<AudioSocketService | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  
  // Guardar config en ref para evitar que cambie la referencia y re-ejecute efectos
  const configRef = useRef<AudioTranscriptionConfig>(config);
  useEffect(() => { 
    configRef.current = config; 
  }, [config]);

  // Actualizar estado de forma segura
  const updateState = useCallback((updates: Partial<AudioTranscriptionState>) => {
    if (!isMountedRef.current) return;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Inicializar servicio de audio
  // Inicialización del servicio — corremos solo una vez al montar
  const initializeAudioService = useCallback(async () => {
    // Evitar múltiples inicializaciones
    if (isInitializedRef.current || !isMountedRef.current) {
      console.log('🔄 Audio service already initialized or component unmounted');
      return true;
    }

    try {
      console.log('🎤 Initializing audio transcription service...');
      isInitializedRef.current = true;

      // Configurar permisos de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Intentar conectar al WebSocket de audio (no bloqueante)
      try {
        audioSocketRef.current = AudioSocketService.getInstance();
        const connected = await audioSocketRef.current.connect();

        setState(prev => ({ ...prev, isSocketConnected: connected }));
        configRef.current.onConnectionStatusChange?.(connected);

        if (connected) {
          console.log('✅ Audio WebSocket connected successfully');
        } else {
          console.warn('⚠️ Audio WebSocket not available - working in offline mode');
          setState(prev => ({ 
            ...prev, 
            error: 'Servidor de transcripción no disponible. Grabación funcional pero sin transcripción automática.' 
          }));
        }
      } catch (socketError) {
        console.warn('⚠️ WebSocket connection failed - continuing in offline mode:', socketError);
        setState(prev => ({ 
          ...prev,
          isSocketConnected: false,
          error: 'Modo offline: La grabación funciona pero la transcripción automática no está disponible.'
        }));
        configRef.current.onConnectionStatusChange?.(false);
      }

      console.log('✅ Audio service initialized (recording available)');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
      console.error('💥 Audio service initialization error:', errorMessage);
      setState(prev => ({ ...prev, error: `Error de inicialización: ${errorMessage}`, isSocketConnected: false }));
      configRef.current.onTranscriptionError?.(errorMessage);
      return false;
    }
  }, []);

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
  }, [state.isRecording, updateState]);

  // Detener grabación y procesar
  const stopRecording = useCallback(async () => {
    try {
      if (!state.isRecording || !recordingRef.current) {
        console.warn('⚠️ Not currently recording');
        return false;
      }

      console.log('⏹️ Stopping audio recording...');

      // Obtener información de la grabación antes de detenerla
      const recordingStatus = await recordingRef.current.getStatusAsync();
      const durationMillis = recordingStatus.durationMillis || 0;
      
      console.log(`📊 Recording duration: ${durationMillis}ms`);
      
      // Validar duración mínima (100ms como requiere el servidor)
      if (durationMillis < 100) {
        throw new Error(`Grabación muy corta: ${durationMillis}ms. Se necesitan al menos 100ms de audio.`);
      }

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
  }, [state.isRecording]);

  // Procesar archivo de audio
  const processAudioFile = useCallback(async (audioUri: string) => {
    try {
      console.log('🔄 Processing audio file...');
      
      // Si no hay conexión WebSocket, simular procesamiento offline
      if (!audioSocketRef.current || !state.isSocketConnected) {
        console.warn('⚠️ No WebSocket connection - simulating offline processing');
        
        updateState({ 
          isProcessing: true,
          transcribedText: 'Procesando en modo offline...'
        });
        
        // Simular procesamiento
          setTimeout(() => {
            const offlineMessage = '🔇 Audio grabado exitosamente. La transcripción automática no está disponible sin conexión al servidor.';
            updateState({ 
              isProcessing: false,
              transcribedText: offlineMessage,
              error: null
            });
            configRef.current.onTranscriptionComplete?.(offlineMessage);
          }, 2000);
        
        return;
      }

      // Leer información del archivo de audio primero
      console.log('📖 Reading audio file:', audioUri);
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      console.log('� File info:', fileInfo);
      
      if (!fileInfo.exists || fileInfo.size === 0) {
        throw new Error('Audio file is empty or does not exist');
      }
      
      // Leer el archivo de audio y convertirlo a base64
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('✅ Audio file read successfully');
      console.log('📊 File size:', fileInfo.size, 'bytes');
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

      // Enviar el archivo completo como un solo chunk para evitar problemas de ensamblado
      console.log(`📦 Sending complete audio file as single chunk, size: ${base64Audio.length} chars`);
      console.log('� First 50 chars of base64:', base64Audio.substring(0, 50) + '...');
      console.log('🔍 Last 50 chars of base64:', '...' + base64Audio.substring(base64Audio.length - 50));
      
      const completeAudioData = {
        chunk: base64Audio, // Enviar todo el archivo
        transmitter_id: config.transmitterId,
        receiver_id: config.receiverId,
        // Metadatos del archivo completo
        isCompleteFile: true,
        totalSize: base64Audio.length,
        fileSize: fileInfo.size,
        audioFormat: {
          sampleRate: 24000,
          channels: 1,
          bitDepth: 16,
          encoding: 'pcm16',
          format: 'wav'
        }
      };
      
      console.log('📤 Sending complete audio data...');
      audioSocketRef.current.sendAudioChunk(completeAudioData);
      console.log('✅ Complete audio file sent successfully');

      // Finalizar grabación y esperar transcripción
      console.log('🏁 All chunks sent, requesting transcription...');
      const transcriptionResult = await audioSocketRef.current.stopRecording({
        transmitter_id: configRef.current.transmitterId,
        receiver_id: configRef.current.receiverId,
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
      
  configRef.current.onTranscriptionComplete?.(transcribedText);

      console.log('✅ Audio transcription completed successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error processing audio';
      console.error('💥 Audio processing error:', errorMessage);
      
      updateState({ 
        error: errorMessage, 
        isProcessing: false,
        transcribedText: ''
      });
      
      configRef.current.onTranscriptionError?.(errorMessage);
    }
  }, [state.isSocketConnected, updateState]);

  // Limpiar texto transcrito
  const clearTranscription = useCallback(() => {
    updateState({ transcribedText: '', error: null });
  }, [updateState]);

  // Limpiar recursos al desmontar
  const cleanup = useCallback(() => {
    console.log('🧹 Starting cleanup of audio transcription service...');
    isMountedRef.current = false;
    
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(console.error);
      recordingRef.current = null;
    }
    if (audioSocketRef.current) {
      audioSocketRef.current.disconnect();
      audioSocketRef.current = null;
    }
    
    // Reset initialization flag
    isInitializedRef.current = false;
    console.log('🧹 Audio transcription service cleaned up');
  }, []);

  // Inicializar al montar (solo una vez). Los callbacks y config se leen desde configRef
  useEffect(() => {
    isMountedRef.current = true;
    
    const initService = async () => {
      if (isMountedRef.current && !isInitializedRef.current) {
        console.log('🚀 Starting audio service initialization...');
        await initializeAudioService();
        if (isMountedRef.current) {
          console.log('✅ Audio service initialized (effect completed)');
        }
      }
    };

    initService();

    return () => {
      console.log('🔄 useEffect cleanup triggered');
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Permitir grabar tanto online como offline; solo bloquear si está procesando
    canRecord: !state.isProcessing,
  };
};