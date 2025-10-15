import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BluetoothService } from '../../services/bluetooth/BluetoothService';
import '../../utils/i18n';

export default function ConnectGloveScreen({ navigation }: any) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectGlove = async () => {
    setIsConnecting(true);
    
    try {
      const bluetoothService = BluetoothService.getInstance();
      await bluetoothService.initialize();
      
      const success = await bluetoothService.connectToDevice('signalink-001');
      
      if (success) {
        setIsConnected(true);
        // Navigate to next screen after a delay
        setTimeout(() => {
          navigation.navigate('HowItWorks');
        }, 1500);
      } else {
        // Show error or retry
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
    }
  };

  const handleSkipConnection = () => {
    navigation.navigate('HowItWorks');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Glove Placeholder */}
          <View style={styles.gloveContainer}>
            <View style={styles.glovePlaceholder}>
              <Text style={styles.gloveText}>
                🖐️
              </Text>
              <Text style={styles.gloveLabel}>
                Signalink Glove
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Connect Your Glove
              </Text>
              <Text style={styles.subtitle}>
                Turn on your Signalink glove and tap the button below to connect via Bluetooth
              </Text>
            </View>

            {/* Connection Status */}
            {isConnected && (
              <View style={styles.successCard}>
                <Text style={styles.successText}>
                  ✅ Glove Connected Successfully!
                </Text>
              </View>
            )}

            {/* Bottom Section */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (isConnecting || isConnected) && styles.buttonDisabled
                ]}
                onPress={handleConnectGlove}
                disabled={isConnecting || isConnected}
              >
                <Text style={styles.primaryButtonText}>
                  {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Glove'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleSkipConnection}
                style={styles.skipButton}
                disabled={isConnecting}
              >
                <Text style={styles.skipButtonText}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  gloveContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  glovePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gloveText: {
    fontSize: 80,
    marginBottom: 8,
  },
  gloveLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  textContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 16,
    lineHeight: 24,
  },
  successCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  successText: {
    color: '#86EFAC',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
});
