import { useCallback, useEffect, useRef, useState } from 'react';
import BluetoothBLEService, { BluetoothCallbacks, BluetoothConnectionStatus } from '../services/bluetooth/BluetoothBLEService';

export interface UseBluetoothGlove {
  // Estados
  connectionStatus: BluetoothConnectionStatus;
  receivedText: string;
  isConnected: boolean;
  error: string | null;
  
  // Acciones
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearReceivedText: () => void;
  clearError: () => void;
}

export const useBluetoothGlove = (): UseBluetoothGlove => {
  const [connectionStatus, setConnectionStatus] = useState<BluetoothConnectionStatus>({
    isConnecting: false,
    isConnected: false,
    isScanning: false,
  });
  const [receivedText, setReceivedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const serviceRef = useRef<BluetoothBLEService | null>(null);

  // Inicializar servicio
  useEffect(() => {
    serviceRef.current = BluetoothBLEService.getInstance();
    
    // Obtener estado inicial
    const currentStatus = serviceRef.current.getConnectionStatus();
    setConnectionStatus(currentStatus);

    return () => {
      // Cleanup al desmontar el componente
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, []);

  // Función para conectar
  const connect = useCallback(async () => {
    if (!serviceRef.current) return;

    setError(null);

    const callbacks: BluetoothCallbacks = {
      onDataReceived: (text: string) => {
        console.log('🧤➡️ Datos del guante:', text);
        setReceivedText(prev => {
          // Si es el mismo texto, no actualizar (evitar duplicados)
          if (prev === text) return prev;
          return text;
        });
      },
      
      onStatusChange: (status: BluetoothConnectionStatus) => {
        console.log('📱 Estado conexión:', status);
        setConnectionStatus(status);
      },
      
      onError: (errorMessage: string) => {
        console.error('🚨 Error BLE:', errorMessage);
        setError(errorMessage);
      },
    };

    try {
      await serviceRef.current.connectToGlove(callbacks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      setError(errorMessage);
    }
  }, []);

  // Función para desconectar
  const disconnect = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.disconnect();
      setReceivedText('');
      setError(null);
    } catch (error) {
      console.error('Error desconectando:', error);
    }
  }, []);

  // Limpiar texto recibido
  const clearReceivedText = useCallback(() => {
    setReceivedText('');
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    connectionStatus,
    receivedText,
    isConnected: connectionStatus.isConnected,
    error,
    connect,
    disconnect,
    clearReceivedText,
    clearError,
  };
};