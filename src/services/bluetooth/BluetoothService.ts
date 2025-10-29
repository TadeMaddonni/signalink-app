import { BluetoothDevice } from '../../types';

export class BluetoothService {
  private static instance: BluetoothService;
  private connectedDevice: BluetoothDevice | null = null;
  private isScanning = false;
  private listeners: Array<(data: any) => void> = [];

  private constructor() {}

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  // Initialize Bluetooth service
  public async initialize(): Promise<boolean> {
    try {
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Bluetooth service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Bluetooth service:', error);
      return false;
    }
  }

  // Check if Bluetooth is enabled
  public async isEnabled(): Promise<boolean> {
    // Mock implementation - always return true
    return true;
  }

  // Start scanning for Signalink devices
  public async startScan(): Promise<void> {
    this.isScanning = true;
    console.log('Started scanning for Signalink devices...');
    
    // Simulate device discovery
    setTimeout(() => {
      this.stopScan();
    }, 5000);
  }

  // Stop scanning
  public stopScan(): void {
    this.isScanning = false;
    console.log('Stopped scanning');
  }

  // Get available devices (mock data)
  public async getAvailableDevices(): Promise<BluetoothDevice[]> {
    return [
      {
        id: 'signalink-001',
        name: 'Signalink Glove Pro',
        isConnected: false,
        signalStrength: 85,
      },
      {
        id: 'signalink-002',
        name: 'Signalink Glove Plus',
        isConnected: false,
        signalStrength: 72,
      },
    ];
  }

  // Connect to a specific device
  public async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      console.log(`Connecting to device: ${deviceId}`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Mock connected device
      this.connectedDevice = {
        id: deviceId,
        name: `Signalink Glove (${deviceId.slice(-3)})`,
        isConnected: true,
        signalStrength: 95,
        lastConnected: new Date(),
      };
      
      console.log('Device connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }

  // Disconnect from current device
  public async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      console.log(`Disconnecting from: ${this.connectedDevice.name}`);
      this.connectedDevice = null;
    }
  }

  // Get connected device
  public getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice;
  }

  // Check if device is connected
  public isConnected(): boolean {
    return this.connectedDevice?.isConnected ?? false;
  }

  // Subscribe to data from glove
  public subscribeToData(callback: (data: any) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Simulate receiving data from glove
  private simulateGloveData(): void {
    if (!this.connectedDevice?.isConnected) return;

    // Generate mock sign language data
    const mockGestures = [
      'hello',
      'thank_you',
      'yes',
      'no',
      'please',
      'sorry',
      'goodbye',
    ];

    const randomGesture = mockGestures[Math.floor(Math.random() * mockGestures.length)];
    
    const signData = {
      gesture: randomGesture,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      timestamp: new Date(),
      batteryLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
      isGloveActive: Math.random() > 0.1, // 90% active
    };

    // Notify all listeners
    this.listeners.forEach(listener => listener(signData));
  }

  // Start periodic data simulation when connected
  public startDataStream(): void {
    if (!this.connectedDevice?.isConnected) return;

    // Simulate receiving data every 2-5 seconds
    const interval = setInterval(() => {
      if (!this.connectedDevice?.isConnected) {
        clearInterval(interval);
        return;
      }
      this.simulateGloveData();
    }, Math.random() * 3000 + 10000);
  }

  // Send command to glove
  public async sendCommand(command: string): Promise<boolean> {
    if (!this.connectedDevice?.isConnected) {
      console.error('No device connected');
      return false;
    }

    try {
      console.log(`Sending command to glove: ${command}`);
      // Simulate command processing
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Failed to send command:', error);
      return false;
    }
  }
}
