import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Card } from '../../components/ui/Card';
import { ChatMessage, TranslationResult } from '../../types';
import { SocketService } from '../../services/api/SocketService';
import { BluetoothService } from '../../services/bluetooth/BluetoothService';
import '../../utils/i18n';

export default function ChatScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const socketService = SocketService.getInstance();
  const bluetoothService = BluetoothService.getInstance();

  useEffect(() => {
    // Initialize socket connection
    const initializeChat = async () => {
      await socketService.connect('user-123');
      setIsConnected(socketService.getConnectionStatus());
      
      // Load message history
      setMessages(socketService.getMessageHistory());
    };

    initializeChat();

    // Subscribe to new messages
    const unsubscribeMessages = socketService.subscribeToMessages(
      'current',
      (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      }
    );

    // Subscribe to translations
    const unsubscribeTranslations = socketService.subscribeToTranslations(
      (translation: TranslationResult) => {
        console.log('Received translation:', translation);
      }
    );

    // Subscribe to glove data
    const unsubscribeGloveData = bluetoothService.subscribeToData((data: any) => {
      if (data.gesture) {
        socketService.simulateGloveInput(data.gesture, 'glove-user', 'Glove User');
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTranslations();
      unsubscribeGloveData();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromCurrentUser: true,
    };

    await socketService.sendMessage(message);
    setNewMessage('');
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} className="px-6 pt-4 pb-2">
          <Text className="text-white text-xl font-inter-medium mb-1">
            Sign Language Chat
          </Text>
          <View className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="text-gray-400 font-inter-light text-sm">
              {isConnected ? 'Connected' : 'Connecting...'}
            </Text>
          </View>
        </Animated.View>

        {/* Messages */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {messages.map((message, index) => (
            <Animatable.View
              key={message.id}
              animation="fadeInUp"
              delay={index * 100}
              className={`mb-4 ${message.isFromCurrentUser ? 'items-end' : 'items-start'}`}
            >
              <Card
                variant="elevated"
                className={`max-w-[80%] ${
                  message.isFromCurrentUser 
                    ? 'bg-primary-500/20 border-primary-500/30' 
                    : 'bg-gray-800/50'
                }`}
              >
                <View>
                  {!message.isFromCurrentUser && (
                    <Text className="text-primary-200 font-inter-medium text-sm mb-1">
                      {message.userName}
                    </Text>
                  )}
                  
                  <Text className="text-white font-inter-light leading-5 mb-2">
                    {message.content}
                  </Text>
                  
                  {/* Translation */}
                  {message.translation && (
                    <View className="bg-primary-500/30 rounded-lg p-2 mb-2">
                      <Text className="text-primary-100 font-inter-light text-xs mb-1">
                        Translation:
                      </Text>
                      <Text className="text-white font-inter-light text-sm">
                        {message.translation.text}
                      </Text>
                      <Text className="text-gray-400 font-inter-light text-xs mt-1">
                        Confidence: {Math.round(message.translation.confidence * 100)}%
                      </Text>
                    </View>
                  )}
                  
                  {/* Sign Data */}
                  {message.signData && (
                    <View className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                      <Text className="text-green-200 font-inter-light text-xs mb-1">
                        Gesture: {message.signData.gesture}
                      </Text>
                      <Text className="text-gray-400 font-inter-light text-xs">
                        Confidence: {Math.round(message.signData.confidence * 100)}%
                      </Text>
                    </View>
                  )}
                  
                  <Text className="text-gray-500 font-inter-light text-xs">
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </Card>
            </Animatable.View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <Animated.View entering={SlideInUp.delay(200)} className="px-6 pb-4">
          <Card variant="outlined" className="bg-gray-800/50">
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 text-white font-inter-light p-3"
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
              />
              
              <TouchableOpacity
                onPress={handleSendMessage}
                className={`p-3 ml-2 rounded-full ${
                  newMessage.trim() ? 'bg-primary-500' : 'bg-gray-700'
                }`}
                disabled={!newMessage.trim()}
              >
                <Text className="text-white">📤</Text>
              </TouchableOpacity>
            </View>
          </Card>
          
          {/* Glove Mode Indicator */}
          <View className="mt-2 p-2 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <Text className="text-primary-200 font-inter-light text-xs text-center">
              🖐️ Glove gestures will appear in chat automatically
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
