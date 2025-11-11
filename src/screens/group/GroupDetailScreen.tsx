import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Bluetooth, Hand, Mic, Send, Square } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useAudioTranscription } from '../../hooks/useAudioTranscription';
import { useBluetoothGlove } from '../../hooks/useBluetoothGlove';
import { MessageService } from '../../services/message';
import { GroupsStackParamList, Message } from '../../types';
import '../../utils/i18n';

type GroupDetailScreenRouteProp = RouteProp<GroupsStackParamList, 'GroupDetail'>;
type GroupDetailScreenNavigationProp = StackNavigationProp<GroupsStackParamList, 'GroupDetail'>; 

export default function GroupDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const route = useRoute<GroupDetailScreenRouteProp>();
  const { groupId, groupName, ownerUsername } = route.params;
  const { user } = useAuth();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const messageService = MessageService.getInstance();

  // Hook para manejar la conexión Bluetooth con el guante
  const {
    connectionStatus,
    receivedText,
    isConnected: isGloveConnected,
    error: bluetoothError,
    connect: connectToGlove,
    disconnect: disconnectFromGlove,
    clearReceivedText,
    clearError
  } = useBluetoothGlove();

  // Log del usuario actual para debugging
  useEffect(() => {
    console.log('👤 Usuario actual en GroupDetail:', user?.id, user?.name);
  }, [user]);

  // Manejar datos recibidos del guante BLE
  useEffect(() => {
    if (receivedText.trim()) {
      console.log('🧤 Texto del guante recibido:', receivedText);
      
      // Enviar automáticamente como mensaje de texto al grupo
      sendGloveMessage(receivedText);
      
      // Limpiar el texto después de un delay
      setTimeout(() => {
        clearReceivedText();
      }, 2000);
    }
  }, [receivedText]);

  // Cargar mensajes al montar el componente
  useEffect(() => {
    loadMessages();
  }, [groupId]);

  // Auto-refresh de mensajes cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages(false); // No mostrar loading en refrescos automáticos
    }, 10000); // 10000ms = 2 segundos

    // Limpiar el interval cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [groupId]);

  // Auto-scroll cuando lleguen nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoadingMessages(true);
      }
      const fetchedMessages = await messageService.getGroupMessages(groupId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Solo mostrar alerta en la carga inicial, no en los refrescos automáticos
      if (showLoading) {
        alert('Error al cargar los mensajes. Intenta de nuevo.');
      }
    } finally {
      if (showLoading) {
        setIsLoadingMessages(false);
      }
    }
  };

  // Hook de transcripción de audio
  const audioTranscription = useAudioTranscription({
    transmitterId: user?.id || 0, // ID del usuario que envía el mensaje
    receiverId: groupId,          // ID del grupo (destinatario)
    onTranscriptionStart: () => {
      console.log('🎙️ Transcription started');
      console.log('📤 Transmitter ID (user):', user?.id, '| Receiver ID (group):', groupId);
    },
    onTranscriptionComplete: async (text: string) => {
      console.log('✅ Transcription completed:', text);
      
      // Enviar el mensaje de audio automáticamente
      await sendAudioMessage(text);
      
      // Limpiar transcripción después de enviar
      setTimeout(() => {
        audioTranscription.clearTranscription();
      }, 10000);
    },
    onTranscriptionError: (error: string) => {
      console.error('❌ Transcription error:', error);
      alert(`Error en la transcripción: ${error}`);
    },
    onConnectionStatusChange: (connected: boolean) => {
      console.log('🔌 Audio connection status:', connected ? 'Connected' : 'Disconnected');
    },
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    try {
      setIsSending(true);
      const newMessage = await messageService.createMessage(groupId, messageText.trim(), 'text');
      
      // Añadir el nuevo mensaje a la lista
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Limpiar el input
      setMessageText('');
      
      // Hacer scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const sendAudioMessage = async (transcribedText: string) => {
    try {
      setIsSending(true);
      const newMessage = await messageService.createAudioMessage(groupId, transcribedText);
      
      // Añadir el nuevo mensaje a la lista
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Hacer scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      console.log('Audio message sent successfully');
    } catch (error) {
      console.error('Error sending audio message:', error);
      alert('Error al enviar el mensaje de audio. Intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const sendGloveMessage = async (gloveText: string) => {
    try {
      setIsSending(true);
      console.log('🧤 Enviando mensaje del guante:', gloveText);
      
      // Crear mensaje con tipo especial para guante
      const newMessage = await messageService.createMessage(groupId, gloveText, 'glove');
      
      // Añadir el nuevo mensaje a la lista
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Hacer scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      console.log('✅ Mensaje del guante enviado correctamente');
    } catch (error) {
      console.error('❌ Error enviando mensaje del guante:', error);
      alert('Error al enviar el mensaje del guante. Intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleRecordSigns = async () => {
    // Validar que el usuario esté logueado
    if (!user?.id) {
      console.error('❌ No hay usuario logueado');
      alert('Debes iniciar sesión para usar el guante');
      return;
    }
    
    // Si ya está conectado, desconectar
    if (isGloveConnected) {
      console.log('🔌 Desconectando del guante...');
      await disconnectFromGlove();
      return;
    }
    
    // Si no está conectado, intentar conectar
    console.log('🧤 Conectando al guante...');
    clearError(); // Limpiar errores previos
    await connectToGlove();
  };





  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleGroupInfoPress = () => {
    navigation.navigate('EditGroup', {
      groupId,
      groupName,
      ownerUsername,
    });
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);

    if (diffMinutes < 1) {
      return 'Ahora';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays}d`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          <View style={styles.innerContent}>
            {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.groupInfo} onPress={handleGroupInfoPress}>
            <Image
              source={require('../../../assets/images/glove.png')}
              style={styles.groupImage}
            />
            <View style={styles.groupTextContainer}>
              <Text style={styles.groupName}>{groupName}</Text>
              <Text style={styles.ownerUsername}>
                {t('groups.createdBy')}: {ownerUsername}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* WebSocket Status Indicator */}
        <View style={styles.socketStatus}>
          <View style={[styles.socketIndicator, { backgroundColor: audioTranscription.isSocketConnected ? '#10B981' : '#EF4444' }]} />
          <Text style={styles.socketStatusText}>
            {audioTranscription.isSocketConnected ? 'Audio conectado' : 'Audio desconectado'}
          </Text>
        </View>

        {/* Body - Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {isLoadingMessages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFC452" />
              <Text style={styles.loadingText}>{t('groups.loadingMessages')}</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyMessagesContainer}>
              <Text style={styles.emptyMessagesText}>
                {t('groups.noMessages')}
              </Text>
              <Text style={styles.emptyMessagesSubtext}>
                {t('groups.startConversation')}
              </Text>
            </View>
          ) : (
            <View style={styles.messagesListContainer}>
              {messages
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((message, index) => {
                const isCurrentUser = user?.id === message.senderId;
                
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      index === 0 && styles.firstMessage,
                      isCurrentUser && styles.messageContainerRight,
                    ]}
                  >
                    <View style={[
                      styles.messageBubble,
                      isCurrentUser && styles.messageBubbleRight,
                    ]}>
                      {message.type === 'audio' && (
                        <View style={styles.audioMessageBadge}>
                          <Mic size={12} color={isCurrentUser ? "#000000" : "#FFC452"} />
                          <Text style={[
                            styles.audioMessageBadgeText,
                            isCurrentUser && styles.audioMessageBadgeTextRight,
                          ]}>Audio</Text>
                        </View>
                      )}
                      <Text style={[
                        styles.messageText,
                        isCurrentUser && styles.messageTextRight,
                      ]}>{message.text}</Text>
                      <Text style={[
                        styles.messageTime,
                        isCurrentUser && styles.messageTimeRight,
                      ]}>
                        {formatMessageTime(message.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Transcribed Text Preview */}
        {audioTranscription.transcribedText ? (
          <View style={styles.transcribedTextContainer}>
            <Text style={styles.transcribedTextLabel}>Texto transcrito:</Text>
            <Text style={styles.transcribedText}>{audioTranscription.transcribedText}</Text>
          </View>
        ) : null}

        {/* Bluetooth Connection Status and Received Text (for glove_user) */}
        {user?.user_type === 'glove_user' && (
          <>
            {/* Connection Status */}
            {(connectionStatus.isConnecting || connectionStatus.isScanning || isGloveConnected || bluetoothError) && (
              <View style={styles.bluetoothStatusContainer}>
                {connectionStatus.isConnecting && (
                  <Text style={styles.bluetoothStatusText}>🔄 Conectando al guante...</Text>
                )}
                {connectionStatus.isScanning && (
                  <Text style={styles.bluetoothStatusText}>🔍 Buscando guante SignaLink...</Text>
                )}
                {isGloveConnected && (
                  <Text style={styles.bluetoothStatusSuccess}>
                    ✅ Conectado a {connectionStatus.deviceName || 'Guante SignaLink'}
                    {connectionStatus.rssi && ` (${connectionStatus.rssi} dBm)`}
                  </Text>
                )}
                {bluetoothError && (
                  <Text style={styles.bluetoothStatusError}>❌ {bluetoothError}</Text>
                )}
              </View>
            )}

            {/* Received Text from Glove */}
            {receivedText && (
              <View style={styles.receivedTextContainer}>
                <Text style={styles.receivedTextLabel}>🧤 Texto del guante:</Text>
                <Text style={styles.receivedText}>{receivedText}</Text>
              </View>
            )}
          </>
        )}

        {/* Footer - Input Area */}
        <View style={styles.footer}>
          {/* Conditional Button based on user type */}
          {user?.user_type === 'glove_user' ? (
            // Glove User: Record Signs Button with Bluetooth connection
            <TouchableOpacity
              style={[
                styles.recordButton, 
                isGloveConnected && styles.recordButtonActive,
                connectionStatus.isConnecting && styles.recordButtonDisabled
              ]}
              onPress={handleRecordSigns}
              disabled={connectionStatus.isConnecting}
            >
              {connectionStatus.isConnecting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : isGloveConnected ? (
                <Bluetooth size={20} color="#ffffff" />
              ) : (
                <Hand size={20} color="#ffffff" />
              )}
              <Text style={styles.recordButtonText}>
                {connectionStatus.isConnecting 
                  ? 'Conectando...'
                  : connectionStatus.isScanning
                    ? 'Buscando...'
                    : isGloveConnected 
                      ? 'Desconectar' 
                      : 'Conectar Guante'
                }
              </Text>
            </TouchableOpacity>
          ) : (
            // Regular User: Voice Transcription Button
            <TouchableOpacity
              style={[
                styles.recordButton, 
                audioTranscription.isRecording && styles.recordButtonActive,
                !audioTranscription.canRecord && styles.recordButtonDisabled
              ]}
              onPress={handleRecordSigns}
              disabled={!audioTranscription.canRecord}
            >
              {audioTranscription.isRecording ? (
                <Square size={20} color="#ffffff" />
              ) : audioTranscription.isProcessing ? (
                <Text style={{ color: '#ffffff', fontSize: 16 }}>⏳</Text>
              ) : (
                <Mic size={20} color="#ffffff" />
              )}
              <Text style={styles.recordButtonText}>
                {audioTranscription.isRecording 
                  ? 'Detener' 
                  : audioTranscription.isProcessing 
                    ? 'Procesando...' 
                    : t('groups.recordSigns')
                }
              </Text>
            </TouchableOpacity>
          )}

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('groups.typeMessage')}
              placeholderTextColor="#9CA3AF"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFC452" />
              ) : (
                <Send
                  size={20}
                  color={messageText.trim() ? '#f99f12' : '#64748b'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  groupInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFC452',
    backgroundColor: '#FFF',
  },
  groupTextContainer: {
    flex: 1,
  },
  groupName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  ownerUsername: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  // Estilos para el estado de conexión Bluetooth
  bluetoothStatusContainer: {
    backgroundColor: '#1F2937',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6', // Azul para Bluetooth
  },
  bluetoothStatusText: {
    color: '#93C5FD', // Azul claro
    fontSize: 14,
    fontWeight: '500',
  },
  bluetoothStatusSuccess: {
    color: '#10B981', // Verde para conectado
    fontSize: 14,
    fontWeight: '600',
  },
  bluetoothStatusError: {
    color: '#EF4444', // Rojo para errores
    fontSize: 14,
    fontWeight: '500',
  },
  // Estilos para el texto recibido del guante
  receivedTextContainer: {
    backgroundColor: '#1F2937',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // Azul para guante
  },
  receivedTextLabel: {
    color: '#3B82F6', // Azul
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  receivedText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  messagesListContainer: {
    gap: 12,
  },
  messageContainer: {
    width: '100%',
  },
  messageContainerRight: {
    alignItems: 'flex-end',
  },
  firstMessage: {
    marginTop: 0,
  },
  messageBubble: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#374151',
  },
  messageBubbleRight: {
    backgroundColor: '#FFC452',
    alignSelf: 'flex-end',
    borderColor: '#F59E0B',
  },
  audioMessageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  audioMessageBadgeText: {
    color: '#FFC452',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  audioMessageBadgeTextRight: {
    color: '#000000',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextRight: {
    color: '#000000',
  },
  messageTime: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeRight: {
    color: '#78350F',
  },
  emptyMessagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyMessagesText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessagesSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    gap: 12,
  },
  recordButton: {
    height: 57,
    borderRadius: 100,
    backgroundColor: '#FFC452',
    paddingHorizontal: 32,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444', // Rojo cuando está grabando
  },
  recordButtonDisabled: {
    backgroundColor: '#6B7280', // Gris cuando está deshabilitado
    opacity: 0.6,
  },
  recordButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1F2937',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcribedTextContainer: {
    backgroundColor: '#1F2937',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC452',
  },
  transcribedTextLabel: {
    color: '#FFC452',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  transcribedText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
  },
  socketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1F2937',
    gap: 8,
  },
  socketIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  socketStatusText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});