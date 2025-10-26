// Ejemplo de uso del hook useAudioTranscription en otros componentes

import { Mic, Square } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioTranscription } from '../hooks/useAudioTranscription';

interface AudioRecorderProps {
  transmitterId: number;
  receiverId: number;
  onTranscriptionReady?: (text: string) => void;
}

export const AudioRecorderComponent: React.FC<AudioRecorderProps> = ({
  transmitterId,
  receiverId,
  onTranscriptionReady,
}) => {
  // Usar el hook de transcripción de audio
  const audioTranscription = useAudioTranscription({
    transmitterId,
    receiverId,
    onTranscriptionComplete: (text) => {
      console.log('Transcripción completada:', text);
      onTranscriptionReady?.(text);
    },
    onTranscriptionError: (error) => {
      console.error('Error en transcripción:', error);
      alert(`Error: ${error}`);
    },
    onConnectionStatusChange: (connected) => {
      console.log('Estado de conexión de audio:', connected);
    },
  });

  return (
    <View style={styles.container}>
      {/* Indicador de estado de conexión */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: audioTranscription.isSocketConnected ? '#10B981' : '#F59E0B' }
          ]}
        />
        <Text style={styles.statusText}>
          {audioTranscription.isSocketConnected ? 'Conectado (Transcripción automática)' : 'Modo Offline (Solo grabación)'}
        </Text>
      </View>

      {/* Botón de grabación */}
      <TouchableOpacity
        style={[
          styles.recordButton,
          audioTranscription.isRecording && styles.recordButtonActive,
          !audioTranscription.canRecord && styles.recordButtonDisabled,
        ]}
        onPress={audioTranscription.toggleRecording}
        disabled={!audioTranscription.canRecord}
      >
        {audioTranscription.isRecording ? (
          <Square size={24} color="#ffffff" />
        ) : audioTranscription.isProcessing ? (
          <Text style={styles.processingIcon}>⏳</Text>
        ) : (
          <Mic size={24} color="#ffffff" />
        )}
        
        <Text style={styles.recordButtonText}>
          {audioTranscription.isRecording
            ? 'Detener Grabación'
            : audioTranscription.isProcessing
            ? 'Procesando...'
            : 'Grabar Audio'
          }
        </Text>
      </TouchableOpacity>

      {/* Texto transcrito */}
      {audioTranscription.transcribedText && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Transcripción:</Text>
          <Text style={styles.transcriptionText}>
            {audioTranscription.transcribedText}
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={audioTranscription.clearTranscription}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mostrar errores */}
      {audioTranscription.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{audioTranscription.error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    margin: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC452',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonDisabled: {
    backgroundColor: '#6B7280',
    opacity: 0.6,
  },
  recordButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  processingIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  transcriptionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC452',
  },
  transcriptionLabel: {
    color: '#FFC452',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  transcriptionText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  clearButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6B7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#FEF2F2',
    fontSize: 14,
  },
});

// Ejemplo de uso en un componente padre:
/*
export const ParentComponent = () => {
  const handleTranscriptionReady = (text: string) => {
    console.log('Texto transcrito listo:', text);
    // Hacer algo con el texto transcrito
  };

  return (
    <View>
      <AudioRecorderComponent
        transmitterId={1}
        receiverId={2}
        onTranscriptionReady={handleTranscriptionReady}
      />
    </View>
  );
};
*/