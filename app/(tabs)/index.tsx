import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { BluetoothService } from '../../src/services/bluetooth/BluetoothService';
import '../../src/utils/i18n'; // Initialize i18n

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel] = useState(85);

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={styles.title}>
              Welcome to Signalink!
            </Text>
            <Text style={styles.subtitle}>
              Connect your glove and start communicating
            </Text>
          </Animated.View>

          {/* Connection Status */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={[styles.statusCard, isConnected ? styles.connectedCard : styles.disconnectedCard]}>
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  Signalink Glove
                </Text>
                <Text style={[styles.statusText, isConnected ? styles.connectedText : styles.disconnectedText]}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <View style={styles.statusIcon}>
                <Text style={styles.iconEmoji}>
                  {isConnected ? '🟢' : '🔴'}
                </Text>
                {isConnected && (
                  <Text style={styles.batteryText}>
                    Battery: {batteryLevel}%
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={SlideInUp.delay(300)}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionEmoji}>🔊</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>
                      Voice Translation Mode
                    </Text>
                    <Text style={styles.actionSubtitle}>
                      Start translating your signs instantly
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionEmoji}>📚</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>
                      Learn Signs
                    </Text>
                    <Text style={styles.actionSubtitle}>
                      Practice new sign language gestures
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionEmoji}>⚙️</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>
                      Settings
                    </Text>
                    <Text style={styles.actionSubtitle}>
                      Configure glove preferences
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Connect Button */}
          {!isConnected && (
            <Animated.View entering={SlideInUp.delay(400)}>
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
            </Animated.View>
          )}

          {/* Navigation Section */}
          <Animated.View entering={SlideInUp.delay(500)}>
            <Text style={styles.sectionTitle}>
              Navigation
            </Text>
            
            <View style={styles.navigationContainer}>
              <TouchableOpacity 
                onPress={() => router.push('/auth/login')}
                style={styles.navButton}
              >
                <View style={styles.navButtonContent}>
                  <Text style={styles.navButtonEmoji}>🔐</Text>
                  <View style={styles.navButtonText}>
                    <Text style={styles.navButtonTitle}>
                      Login Screen
                    </Text>
                    <Text style={styles.navButtonSubtitle}>
                      View the authentication screen
                    </Text>
                  </View>
                  <Text style={styles.navButtonArrow}>→</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/auth/register')}
                style={styles.navButton}
              >
                <View style={styles.navButtonContent}>
                  <Text style={styles.navButtonEmoji}>📝</Text>
                  <View style={styles.navButtonText}>
                    <Text style={styles.navButtonTitle}>
                      Register Screen
                    </Text>
                    <Text style={styles.navButtonSubtitle}>
                      Create a new account
                    </Text>
                  </View>
                  <Text style={styles.navButtonArrow}>→</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/onboarding/connect-glove')}
                style={styles.navButton}
              >
                <View style={styles.navButtonContent}>
                  <Text style={styles.navButtonEmoji}>🖐️</Text>
                  <View style={styles.navButtonText}>
                    <Text style={styles.navButtonTitle}>
                      Connect Glove Tutorial
                    </Text>
                    <Text style={styles.navButtonSubtitle}>
                      See the onboarding flow
                    </Text>
                  </View>
                  <Text style={styles.navButtonArrow}>→</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/explore')}
                style={styles.navButton}
              >
                <View style={styles.navButtonContent}>
                  <Text style={styles.navButtonEmoji}>🌟</Text>
                  <View style={styles.navButtonText}>
                    <Text style={styles.navButtonTitle}>
                      Explore Tab
                    </Text>
                    <Text style={styles.navButtonSubtitle}>
                      Check out the explore screen
                    </Text>
                  </View>
                  <Text style={styles.navButtonArrow}>→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Features Summary */}
          <Animated.View entering={SlideInUp.delay(600)}>
            <View style={styles.featuresCard}>
              <View style={styles.featuresContent}>
                <Text style={styles.featuresTitle}>
                  🎉 Signalink App Features
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>
                      Authentication Flow (Login/Register)
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>
                      Onboarding Tutorial (Figma Design)
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>
                      Bluetooth Glove Simulation
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>
                      Smooth Animations & Transitions
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
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
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 24,
  },
  statusCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectedCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  disconnectedCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  connectedText: {
    color: 'rgba(34, 197, 94, 1)',
  },
  disconnectedText: {
    color: 'rgba(239, 68, 68, 1)',
  },
  statusIcon: {
    alignItems: 'flex-end',
  },
  iconEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  batteryText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  connectButtonContainer: {
    marginTop: 32,
  },
  connectButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  navigationContainer: {
    gap: 12,
  },
  navButton: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonEmoji: {
    color: '#ffffff',
    fontSize: 24,
    marginRight: 12,
  },
  navButtonText: {
    flex: 1,
  },
  navButtonTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  navButtonSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  navButtonArrow: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  featuresCard: {
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    borderRadius: 16,
    marginTop: 32,
  },
  featuresContent: {
    padding: 16,
  },
  featuresTitle: {
    color: 'rgba(249, 159, 18, 0.8)',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    color: '#10B981',
    marginRight: 8,
    fontSize: 16,
  },
  featureText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});