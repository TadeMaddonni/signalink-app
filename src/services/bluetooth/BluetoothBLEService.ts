import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';

// Constantes para el guante SignaLink
const GLOVE_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const GLOVE_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2';
const GLOVE_DEVICE_NAME = 'SignaLinkCM4';

export interface BluetoothConnectionStatus {
  isConnecting: boolean;
  isConnected: boolean;
  isScanning: boolean;
  lastError?: string;
  deviceName?: string;
  rssi?: number;
}

export interface BluetoothCallbacks {
  onDataReceived: (text: string) => void;
  onStatusChange: (status: BluetoothConnectionStatus) => void;
  onError: (error: string) => void;
}

class BluetoothBLEService {
  private static instance: BluetoothBLEService;
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private callbacks: BluetoothCallbacks | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  private constructor() {
    this.manager = new BleManager();
    this.setupManager();
  }

  public static getInstance(): BluetoothBLEService {
    if (!BluetoothBLEService.instance) {
      BluetoothBLEService.instance = new BluetoothBLEService();
    }
    return BluetoothBLEService.instance;
  }

  private setupManager() {
    // Monitor del estado del Bluetooth
    this.manager.onStateChange((state) => {
      console.log(`📶 Estado Bluetooth: ${state}`);
      if (state === State.PoweredOn) {
        console.log('✅ Bluetooth listo');
      } else if (state === State.PoweredOff) {
        console.log('❌ Bluetooth desactivado');
        this.callbacks?.onError('Bluetooth desactivado. Actívalo para continuar.');
      }
    }, true);
  }

  /**
   * Solicita permisos necesarios para BLE
   */
  private async requestPermissions(): Promise<boolean> {
    console.log('🔐 Solicitando permisos Bluetooth...');
    
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);

        const allGranted = Object.values(grants).every(
          (grant) => grant === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          console.log('❌ Permisos denegados');
          return false;
        }
      } catch (error) {
        console.error('❌ Error solicitando permisos:', error);
        return false;
      }
    }

    console.log('✅ Permisos concedidos');
    return true;
  }

  /**
   * Verifica el estado del Bluetooth
   */
  private async checkBluetoothState(): Promise<boolean> {
    const state = await this.manager.state();
    console.log(`📶 Estado actual del Bluetooth: ${state}`);
    
    if (state !== State.PoweredOn) {
      const message = state === State.PoweredOff 
        ? 'Activa el Bluetooth para conectar con el guante'
        : 'Bluetooth no disponible';
      
      this.callbacks?.onError(message);
      return false;
    }
    
    return true;
  }

  /**
   * Inicia el escaneo del guante
   */
  private startScan(): Promise<Device> {
    return new Promise((resolve, reject) => {
      console.log('🔍 Iniciando escaneo del guante...');
      
      this.updateStatus({ isScanning: true });

      // Timeout para el escaneo
      const scanTimeout = setTimeout(() => {
        this.manager.stopDeviceScan();
        this.updateStatus({ isScanning: false });
        reject(new Error('Tiempo de escaneo agotado. ¿El guante está encendido?'));
      }, 10000); // 10 segundos

      this.manager.startDeviceScan(
        [GLOVE_SERVICE_UUID], // Escanear solo nuestro servicio
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            clearTimeout(scanTimeout);
            this.manager.stopDeviceScan();
            this.updateStatus({ isScanning: false });
            reject(error);
            return;
          }

          if (device && (
            device.name === GLOVE_DEVICE_NAME || 
            device.localName === GLOVE_DEVICE_NAME
          )) {
            console.log(`🧤 Guante detectado: ${device.name} (${device.id})`);
            console.log(`📶 RSSI: ${device.rssi} dBm`);
            
            clearTimeout(scanTimeout);
            this.manager.stopDeviceScan();
            this.updateStatus({ 
              isScanning: false, 
              deviceName: device.name || device.localName || undefined,
              rssi: device.rssi || undefined 
            });
            resolve(device);
          }
        }
      );
    });
  }

  /**
   * Se conecta al dispositivo guante
   */
  private async connectToDevice(device: Device): Promise<Device> {
    console.log(`🔗 Conectando al guante ${device.name}...`);
    
    this.updateStatus({ isConnecting: true });

    try {
      // Conectar al dispositivo
      const connectedDevice = await device.connect({
        requestMTU: 512,
        timeout: 5000,
      });

      console.log('✅ Conectado al guante');

      // Descubrir servicios
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('🔍 Servicios descubiertos');

      // Configurar listener de desconexión
      connectedDevice.onDisconnected((error) => {
        console.log('❌ Guante desconectado:', error?.message || 'Sin error');
        this.handleDisconnection();
      });

      this.connectedDevice = connectedDevice;
      this.reconnectAttempts = 0;
      
      this.updateStatus({ 
        isConnecting: false, 
        isConnected: true,
        lastError: undefined
      });

      return connectedDevice;
    } catch (error) {
      this.updateStatus({ isConnecting: false });
      throw error;
    }
  }

  /**
   * Configura la suscripción a la característica
   */
  private async setupCharacteristicNotification(device: Device) {
    console.log('📡 Configurando recepción de datos...');

    try {
      // Suscribirse a la característica para recibir datos
      await device.monitorCharacteristicForService(
        GLOVE_SERVICE_UUID,
        GLOVE_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Error monitoreando característica:', error.message);
            this.callbacks?.onError(`Error recibiendo datos: ${error.message}`);
            return;
          }

          if (characteristic?.value) {
            try {
              // Decodificar datos Base64
              const data = Buffer.from(characteristic.value, 'base64').toString('utf-8');
              console.log(`📩 Texto recibido: "${data}"`);
              
              // Llamar al callback con los datos
              this.callbacks?.onDataReceived(data.trim());
            } catch (decodeError) {
              console.error('❌ Error decodificando datos:', decodeError);
            }
          }
        }
      );

      console.log('✅ Listener configurado. Esperando señales del guante...');
    } catch (error) {
      throw new Error(`Error configurando notificaciones: ${error}`);
    }
  }

  /**
   * Maneja la desconexión del dispositivo
   */
  private handleDisconnection() {
    if (this.isDestroyed) return;

    this.connectedDevice = null;
    this.updateStatus({ 
      isConnected: false,
      isConnecting: false,
      lastError: 'Conexión perdida'
    });

    // Intentar reconexión automática
    this.scheduleReconnection();
  }

  /**
   * Programa una reconexión con backoff exponencial
   */
  private scheduleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.isDestroyed) {
      console.log('❌ Máximo de intentos de reconexión alcanzado');
      this.callbacks?.onError('No se pudo reconectar al guante. Intenta manualmente.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000); // Max 10 segundos
    
    console.log(`⚠️ Reintentando conexión en ${delay / 1000}s (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(async () => {
      if (this.isDestroyed) return;
      
      try {
        await this.connectToGlove(this.callbacks!);
      } catch (error) {
        console.error('❌ Fallo en reconexión:', error);
        this.scheduleReconnection();
      }
    }, delay);
  }

  /**
   * Actualiza el estado de la conexión
   */
  private updateStatus(updates: Partial<BluetoothConnectionStatus>) {
    if (this.callbacks) {
      const currentStatus: BluetoothConnectionStatus = {
        isConnecting: false,
        isConnected: false,
        isScanning: false,
        ...updates
      };
      this.callbacks.onStatusChange(currentStatus);
    }
  }

  /**
   * Función principal para conectar al guante
   */
  public async connectToGlove(callbacks: BluetoothCallbacks): Promise<void> {
    this.callbacks = callbacks;

    try {
      // 1. Solicitar permisos
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error('Permisos de Bluetooth requeridos');
      }

      // 2. Verificar estado del Bluetooth
      const isBluetoothReady = await this.checkBluetoothState();
      if (!isBluetoothReady) {
        return;
      }

      // 3. Escanear el guante
      const device = await this.startScan();

      // 4. Conectar al dispositivo
      const connectedDevice = await this.connectToDevice(device);

      // 5. Configurar recepción de datos
      await this.setupCharacteristicNotification(connectedDevice);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en conexión:', errorMessage);
      
      this.updateStatus({ 
        isConnecting: false, 
        isScanning: false,
        lastError: errorMessage 
      });
      
      this.callbacks?.onError(errorMessage);
    }
  }

  /**
   * Desconecta del guante
   */
  public async disconnect(): Promise<void> {
    console.log('🔌 Desconectando del guante...');

    // Cancelar reconexión
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Desconectar dispositivo
    if (this.connectedDevice) {
      try {
        await this.connectedDevice.cancelConnection();
        console.log('✅ Desconectado correctamente');
      } catch (error) {
        console.error('❌ Error en desconexión:', error);
      }
      this.connectedDevice = null;
    }

    this.updateStatus({ 
      isConnected: false,
      isConnecting: false,
      isScanning: false,
      lastError: undefined
    });

    this.callbacks = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Obtiene el estado actual de la conexión
   */
  public getConnectionStatus(): BluetoothConnectionStatus {
    return {
      isConnecting: false,
      isConnected: !!this.connectedDevice,
      isScanning: false,
      deviceName: this.connectedDevice?.name || undefined,
    };
  }

  /**
   * Destruye la instancia del servicio
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.disconnect();
    this.manager.destroy();
  }

  /**
   * Envía un comando al guante (opcional para casos futuros)
   */
  public async sendCommand(command: string): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No hay guante conectado');
    }

    try {
      const data = Buffer.from(command, 'utf-8').toString('base64');
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        GLOVE_SERVICE_UUID,
        GLOVE_CHARACTERISTIC_UUID,
        data
      );
      console.log(`📤 Comando enviado: "${command}"`);
    } catch (error) {
      throw new Error(`Error enviando comando: ${error}`);
    }
  }
}

export default BluetoothBLEService;