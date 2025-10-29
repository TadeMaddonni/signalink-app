import { ChatMessage, TranslationResult } from '../../types';

export class SocketService {
  private static instance: SocketService;
  private isConnected = false;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private messageHistory: ChatMessage[] = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Connect to chat server
  async connect(userId: string): Promise<boolean> {
    try {
      console.log(`Connecting to chat server for user: ${userId}`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isConnected = true;
      console.log('Connected to chat server');
      
      // Simulate receiving some chat messages
      this.simulateIncomingMessages();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to chat server:', error);
      return false;
    }
  }

  // Disconnect from chat server
  async disconnect(): Promise<void> {
    console.log('Disconnecting from chat server');
    this.isConnected = false;
    this.listeners.clear();
  }

  // Join a chat room
  async joinRoom(roomId: string): Promise<boolean> {
    try {
      console.log(`Joining room: ${roomId}`);
      
      // Simulate room join delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Successfully joined room: ${roomId}`);
      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  }

  // Leave a chat room
  async leaveRoom(roomId: string): Promise<void> {
    console.log(`Leaving room: ${roomId}`);
    this.removeListeners(`message:${roomId}`);
  }

  // Send a message to the current room
  async sendMessage(message: ChatMessage): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to chat server');
    }

    try {
      console.log(`Sending message: ${message.content}`);
      
      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add message to history
      this.messageHistory.push(message);
      
      // Broadcast to listeners
      this.broadcast(`message:${message.id}`, message);
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Subscribe to messages for a specific room
  subscribeToMessages(roomId: string, callback: (message: ChatMessage) => void): () => void {
    const eventKey = `message:${roomId}`;
    
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, []);
    }
    
    this.listeners.get(eventKey)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const roomListeners = this.listeners.get(eventKey);
      if (roomListeners) {
        const filtered = roomListeners.filter(listener => listener !== callback);
        if (filtered.length === 0) {
          this.listeners.delete(eventKey);
        } else {
          this.listeners.set(eventKey, filtered);
        }
      }
    };
  }

  // Subscribe to translation updates
  subscribeToTranslations(callback: (translation: TranslationResult) => void): () => void {
    const eventKey = 'translation';
    
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, []);
    }
    
    this.listeners.get(eventKey)!.push(callback);
    
    return () => {
      const listeners = this.listeners.get(eventKey);
      if (listeners) {
        const filtered = listeners.filter(listener => listener !== callback);
        if (filtered.length === 0) {
          this.listeners.delete(eventKey);
        } else {
          this.listeners.set(eventKey, filtered);
        }
      }
    };
  }

  // Get message history
  getMessageHistory(roomId?: string): ChatMessage[] {
    // For simplicity, return all messages regardless of room
    return [...this.messageHistory];
  }

  // Check connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Private method to broadcast events
  private broadcast(eventKey: string, data: any): void {
    const listeners = this.listeners.get(eventKey);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  // Remove listeners for a specific event
  private removeListeners(eventKey: string): void {
    this.listeners.delete(eventKey);
  }

  // Simulate incoming messages from fromglove
  private simulateIncomingMessages(): void {
    if (!this.isConnected) return;

    const mockMessages = [
      {
        id: '1',
        userId: 'glove-user-1',
        userName: 'SignLanguage User',
        content: 'Hello! 👋',
        timestamp: new Date(Date.now() - 5000),
        isFromCurrentUser: false,
      },
      {
        id: '2',
        userId: 'glove-user-2',
        userName: 'Glove User',
        content: 'Thank you for your help',
        translation: {
          text: 'Thank you for your help',
          language: 'en',
          confidence: 0.92,
        },
        timestamp: new Date(Date.now() - 3000),
        isFromCurrentUser: false,
      },
    ];

    // Simulate receiving messages over time
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (!this.isConnected || messageIndex >= mockMessages.length) {
        clearInterval(interval);
        return;
      }
      
      const message = mockMessages[messageIndex];
      this.messageHistory.push(message);
      
      // Broadcast to all message listeners
      this.listeners.forEach((listeners, key) => {
        if (key.startsWith('message:')) {
          listeners.forEach(listener => listener(message));
        }
      });
      
      messageIndex++;
    }, 10000);
  }

  // Simulate receiving glove data and trigger translation
  public simulateGloveInput(gesture: string, userId: string, userName: string): void {
    if (!this.isConnected) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      content: `[Gesture: ${gesture}]`,
      signData: {
        id: Date.now().toString(),
        gesture,
        translation: '', // Will be filled by translation service
        confidence: Math.random() * 0.2 + 0.8, // 80-100%
        timestamp: new Date(),
      },
      timestamp: new Date(),
      isFromCurrentUser: false,
    };

    this.messageHistory.push(message);
    this.broadcast('message:current', message);

    // Trigger translation
    const translation: TranslationResult = {
      text: this.getTranslationForGesture(gesture),
      language: 'es',
      confidence: Math.random() * 0.1 + 0.9,
    };

    this.broadcast('translation', translation);
  }

  // Helper method to get translations (simple mock)
  private getTranslationForGesture(gesture: string): string {
    const translations: Record<string, string> = {
      'hello': 'Hola',
      'thank_you': 'Gracias',
      'yes': 'Sí',
      'no': 'No',
      'please': 'Por favor',
      'sorry': 'Lo siento',
      'goodbye': 'Adiós',
    };
    
    return translations[gesture] || `[Gesture: ${gesture}]`;
  }
}
