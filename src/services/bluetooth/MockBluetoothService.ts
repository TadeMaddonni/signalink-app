// Mock del BluetoothBLEService para testing con Expo Go
export class MockBluetoothBLEService {
  private static instance: MockBluetoothBLEService | null = null;
  private callbacks = {
    onDataReceived: null as ((data: string) => void) | null,
    onStatusChange: null as ((status: string) => void) | null,
    onError: null as ((error: string) => void) | null,
  };

  static getInstance(): MockBluetoothBLEService {
    if (!MockBluetoothBLEService.instance) {
      MockBluetoothBLEService.instance = new MockBluetoothBLEService();
    }
    return MockBluetoothBLEService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    console.log('🧪 [MOCK] Requesting Bluetooth permissions...');
    return true;
  }

  async startScanning(): Promise<void> {
    console.log('🧪 [MOCK] Starting BLE scan...');
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange('🔍 Buscando guante SignaLink... (SIMULADO)');
    }

    // Simular encontrar dispositivo después de 2 segundos
    setTimeout(() => {
      this.simulateConnection();
    }, 2000);
  }

  private simulateConnection(): void {
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange('🔄 Conectando al guante... (SIMULADO)');
    }

    // Simular conexión exitosa después de 3 segundos
    setTimeout(() => {
      if (this.callbacks.onStatusChange) {
        this.callbacks.onStatusChange('✅ Conectado a SignaLinkCM4 (-45 dBm) [SIMULADO]');
      }
      
      // Simular recepción de datos cada 5 segundos
      this.startSimulatedDataReception();
    }, 3000);
  }

  private startSimulatedDataReception(): void {
    const mockMessages = [
      'Hola, este es un mensaje simulado del guante',
      'Gesture detectado: saludo',
      'Señal de OK recibida',
      'Movimiento complejo procesado',
      'Testing funcionalidad BLE'
    ];

    let messageIndex = 0;
    
    const interval = setInterval(() => {
      if (this.callbacks.onDataReceived && messageIndex < mockMessages.length) {
        this.callbacks.onDataReceived(mockMessages[messageIndex]);
        messageIndex++;
        
        if (messageIndex >= mockMessages.length) {
          clearInterval(interval);
        }
      }
    }, 8000);
  }

  async disconnect(): Promise<void> {
    console.log('🧪 [MOCK] Disconnecting from glove...');
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange('❌ Desconectado del guante (SIMULADO)');
    }
  }

  setOnDataReceived(callback: (data: string) => void): void {
    this.callbacks.onDataReceived = callback;
  }

  setOnStatusChange(callback: (status: string) => void): void {
    this.callbacks.onStatusChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.callbacks.onError = callback;
  }

  cleanup(): void {
    console.log('🧪 [MOCK] Cleaning up mock service...');
    this.callbacks = {
      onDataReceived: null,
      onStatusChange: null,
      onError: null,
    };
  }
}