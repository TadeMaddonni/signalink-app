import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Mic, Send, Square } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import { useAudioTranscription } from '../../hooks/useAudioTranscription';
import { GroupsStackParamList } from '../../types';
import '../../utils/i18n';

type GroupDetailScreenRouteProp = RouteProp<GroupsStackParamList, 'GroupDetail'>;
type GroupDetailScreenNavigationProp = StackNavigationProp<GroupsStackParamList, 'GroupDetail'>; 

export default function GroupDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const route = useRoute<GroupDetailScreenRouteProp>();
  const { groupId, groupName, ownerUsername } = route.params;

  const [messageText, setMessageText] = useState('');

  // Hook de transcripción de audio
  const audioTranscription = useAudioTranscription({
    transmitterId: 1, // TODO: Obtener del contexto de auth
    receiverId: 2,    // TODO: Obtener del contexto de auth o props
    onTranscriptionStart: () => {
      console.log('🎙️ Transcription started');
    },
    onTranscriptionComplete: (text: string) => {
      console.log('✅ Transcription completed:', text);
      alert('Audio transcrito correctamente!');
      
      // Auto-limpiar después de 10 segundos
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

  const handleSendMessage = () => {
    // TODO: Implementar envío de mensajes
    console.log('Send message:', messageText);
    setMessageText('');
  };

  const handleRecordSigns = async () => {
    // Usar el hook de transcripción
    await audioTranscription.toggleRecording();
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
              source={require('../../../assets/images/group.png')}
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
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          <View style={styles.emptyMessagesContainer}>
            <Text style={styles.emptyMessagesText}>
              {t('groups.noMessages')}
            </Text>
            <Text style={styles.emptyMessagesSubtext}>
              {t('groups.startConversation')}
            </Text>
          </View>
        </ScrollView>

        {/* Transcribed Text Preview */}
        {audioTranscription.transcribedText ? (
          <View style={styles.transcribedTextContainer}>
            <Text style={styles.transcribedTextLabel}>Texto transcrito:</Text>
            <Text style={styles.transcribedText}>{audioTranscription.transcribedText}</Text>
          </View>
        ) : null}

        {/* Footer - Input Area */}
        <View style={styles.footer}>
          {/* Record Signs Button */}
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
              disabled={!messageText.trim()}
            >
              <Send
                size={20}
                color={messageText.trim() ? '#f99f12' : '#64748b'}
              />
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    // Sin padding inferior ya que el menú está oculto en esta pantalla
  },
  emptyMessagesContainer: {
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