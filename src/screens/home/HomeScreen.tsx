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

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);

  const bluetoothService = BluetoothService.getInstance();

  React.useEffect(() => {
    setIsConnected(bluetoothService.isConnected());
    
    if (bluetoothService.isConnected()) {
      bluetoothService.startDataStream();
    }
  }, []);

  const handleConnectGlove = async () => {
    await bluetoothService.connectToDevice('signalink-001');
    setIsConnected(bluetoothService.isConnected());
    setBatteryLevel(Math.floor(Math.random() * 40) + 60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Welcome back!
            </Text>
            <Text style={styles.subtitle}>
              Your Signalink is ready to communicate
            </Text>
          </View>

          {/* Connection Status */}
          <View style={[
            styles.statusCard,
            isConnected ? styles.statusCardConnected : styles.statusCardDisconnected
          ]}>
            <View style={styles.statusContent}>
              <View>
                <Text style={styles.statusTitle}>
                  Signalink Glove
                </Text>
                <Text style={[
                  styles.statusText,
                  isConnected ? styles.statusTextConnected : styles.statusTextDisconnected
                ]}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <View style={styles.statusRight}>
                <Text style={styles.statusIcon}>
                  {isConnected ? '🟢' : '🔴'}
                </Text>
                {isConnected && (
                  <Text style={styles.batteryText}>
                    Battery: {batteryLevel}%
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>
            
            <View style={styles.actionsList}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>🔊</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>
                      Voice Translation Mode
                    </Text>
                    <Text style={styles.actionDescription}>
                      Start translating your signs instantly
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>📚</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>
                      Learn Signs
                    </Text>
                    <Text style={styles.actionDescription}>
                      Practice new sign language gestures
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>⚙️</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>
                      Settings
                    </Text>
                    <Text style={styles.actionDescription}>
                      Configure glove preferences
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Connect Button */}
          {!isConnected && (
            <View style={styles.connectButtonContainer}>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleConnectGlove}
              >
                <Text style={styles.connectButtonText}>
                  Connect Signalink Glove
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusCardConnected: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusCardDisconnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
  },
  statusTextConnected: {
    color: '#86EFAC',
  },
  statusTextDisconnected: {
    color: '#FCA5A5',
  },
  statusRight: {
    alignItems: 'flex-end',
  },
  statusIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  batteryText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsList: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  connectButtonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  connectButton: {
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
  connectButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
