import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BluetoothService } from '../../services/bluetooth/BluetoothService';
import '../../utils/i18n';

export default function HomeScreen() {
  const { t } = useTranslation();
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

  const quickActions = [
    { icon: '🔊', title: 'Voice Mode', action: () => console.log('Voice mode') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className="text-white text-2xl font-inter-medium mb-2">
              Welcome back!
            </Text>
            <Text className="text-gray-400 font-inter-light">
              Your Signalink is ready to communicate
            </Text>
          </Animated.View>

          {/* Connection Status */}
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <Card 
              variant="elevated" 
              className={isConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-inter-medium text-lg mb-1">
                    Signalink Glove
                  </Text>
                  <Text className={isConnected ? 'text-green-300' : 'text-red-300'}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white text-4xl mb-2">
                    {isConnected ? '🟢' : '🔴'}
                  </Text>
                  {isConnected && (
                    <Text className="text-gray-400 text-sm">
                      Battery: {batteryLevel}%
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={SlideInUp.delay(300)} className="mt-6">
            <Text className="text-white text-lg font-inter-medium mb-4">
              Quick Actions
            </Text>
            
            <View className="gap-4">
              <TouchableOpacity>
                <Card variant="elevated" className="bg-gradient-to-r from-primary-500/20 to-green-500/20 border border-primary-500/30">
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">🔊</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg mb-1">
                        Voice Translation Mode
                      </Text>
                      <Text className="text-gray-300 font-inter-light">
                        Start translating your signs instantly
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">📚</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg mb-1">
                        Learn Signs
                      </Text>
                      <Text className="text-gray-300 font-inter-light">
                        Practice new sign language gestures
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">⚙️</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg mb-1">
                        Settings
                      </Text>
                      <Text className="text-gray-300 font-inter-light">
                        Configure glove preferences
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Connect Button */}
          {!isConnected && (
            <Animated.View entering={SlideInUp.delay(400)} className="mt-8">
              <Button
                title="Connect Signalink Glove"
                onPress={handleConnectGlove}
                variant="primary"
                size="lg"
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
