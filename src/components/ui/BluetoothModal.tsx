import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Bluetooth, RefreshCw, CheckCircle, X } from 'lucide-react-native';
import { Modal } from './Modal';
import { useBluetoothGlove } from '../../hooks/useBluetoothGlove';

interface BluetoothModalProps {
  visible: boolean;
  onClose: () => void;
  onDeviceConnected: () => void;
}

export const BluetoothModal: React.FC<BluetoothModalProps> = ({
  visible,
  onClose,
  onDeviceConnected,
}) => {
  const {
    connectionStatus,
    isConnected,
    error: bluetoothError,
    connect: connectToGlove,
    disconnect: disconnectFromGlove,
    clearError,
  } = useBluetoothGlove();

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (visible) {
      clearError();
    }
  }, [visible, clearError]);

  useEffect(() => {
    if (isConnected) {
      onDeviceConnected();
      onClose();
    }
  }, [isConnected, onDeviceConnected, onClose]);

  const handleConnect = async () => {
    try {
      setIsScanning(true);
      clearError();
      await connectToGlove();
    } catch (error) {
      console.error('Error connecting to glove:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar al guante. Asegúrate de que esté encendido y cerca.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromGlove();
    } catch (error) {
      console.error('Error disconnecting from glove:', error);
    }
  };

  const renderConnectionStatus = () => {
    if (isConnected) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.connectedStatus}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.connectedText}>
              Conectado a {connectionStatus.deviceName || 'SignaLink Glove'}
            </Text>
            {connectionStatus.rssi && (
              <Text style={styles.rssiText}>
                Señal: {connectionStatus.rssi} dBm
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <X size={16} color="#ffffff" />
            <Text style={styles.disconnectButtonText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (connectionStatus.isConnecting || isScanning) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.connectingStatus}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.connectingText}>
              {connectionStatus.isScanning ? 'Buscando guante...' : 'Conectando...'}
            </Text>
          </View>
        </View>
      );
    }

    if (bluetoothError) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.errorStatus}>
            <Text style={styles.errorText}>❌ {bluetoothError}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Conectar Guante SignaLink"
      showCloseButton={true}
    >
      <View style={styles.container}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Bluetooth size={32} color="#3B82F6" />
          <Text style={styles.headerText}>
            Vincula tu guante SignaLink para enviar mensajes con señas
          </Text>
        </View>

        {/* Connection Status */}
        {renderConnectionStatus()}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instrucciones:</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>• Enciende tu guante SignaLink</Text>
            <Text style={styles.instructionItem}>• Mantén el guante cerca del dispositivo</Text>
            <Text style={styles.instructionItem}>• Toca "Buscar Guante" para conectar</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isConnected && (
            <TouchableOpacity
              style={[
                styles.connectButton,
                (connectionStatus.isConnecting || isScanning) && styles.connectButtonDisabled
              ]}
              onPress={handleConnect}
              disabled={connectionStatus.isConnecting || isScanning}
            >
              {connectionStatus.isConnecting || isScanning ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <RefreshCw size={20} color="#ffffff" />
              )}
              <Text style={styles.connectButtonText}>
                {connectionStatus.isConnecting || isScanning ? 'Buscando...' : 'Buscar Guante'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Device Info */}
        <View style={styles.deviceInfoContainer}>
          <Text style={styles.deviceInfoTitle}>Información del Dispositivo</Text>
          <Text style={styles.deviceInfoText}>
            Nombre: SignaLinkCM4
          </Text>
          <Text style={styles.deviceInfoText}>
            Tipo: Guante de señas Bluetooth
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  statusContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  connectedStatus: {
    backgroundColor: '#064E3B',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: 12,
  },
  connectedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  rssiText: {
    color: '#6EE7B7',
    fontSize: 14,
    marginTop: 4,
  },
  connectingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    gap: 12,
  },
  connectingText: {
    color: '#93C5FD',
    fontSize: 16,
    fontWeight: '500',
  },
  errorStatus: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 15,
    lineHeight: 20,
  },
  instructionsContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  instructionsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  connectButtonDisabled: {
    backgroundColor: '#6B7280',
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  disconnectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  deviceInfoContainer: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  deviceInfoTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  deviceInfoText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
});