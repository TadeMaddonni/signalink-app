import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Button } from '../../components/ui/Button';
import { BluetoothService } from '../../services/bluetooth/BluetoothService';
import '../../utils/i18n'; // Initialize i18n

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ConnectGloveScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Animation values
  const glowScale = useSharedValue(1);
  const gloveRotation = useSharedValue(0);
  const gloveOpacity = useSharedValue(0.7);

  useEffect(() => {
    // Animate glow effect
    glowScale.value = withRepeat(
      withSpring(1.3, { damping: 20 }),
      -1,
      true
    );
    
    // Animate glove rotation
    gloveRotation.value = withRepeat(
      withSpring(25, { damping: 15 }),
      -1,
      true
    );
    
    // Animate glove opacity
    gloveOpacity.value = withRepeat(
      withSpring(1, { damping: 10 }),
      -1,
      true
    );
  }, []);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const gloveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${gloveRotation.value}deg` }],
    opacity: gloveOpacity.value,
  }));

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
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          {/* Glove Image Background */}
          <View className="absolute top-10 right-0">
            <Animated.View style={gloveAnimatedStyle}>
              {/* Rotated glove placeholder - would be actual image in production */}
              <View className="w-80 h-[400px] bg-gradient-to-br from-primary-500/20 to-green-500/20 rounded-t-full">
                <View className="w-full h-full bg-gray-800/80 rounded-t-full items-center justify-center">
                  <Text className="text-white text-lg font-inter-light">
                    Signalink Glove
                  </Text>
                </View>
              </View>
            </Animated.View>
            
            {/* Glowing effect */}
            <Animated.View
              style={glowAnimatedStyle}
              className="absolute top-20 w-32 h-32 bg-primary-500/30 rounded-full blur-xl"
            />
          </View>

          {/* Content */}
          <View className="px-6 pt-20 pb-16 flex-1">
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <Text 
                className="text-white text-2xl mb-4 font-inter-medium"
                style={{
                  textShadowColor: '#d2981d',
                  textShadowOffset: { width: 0, height: 0.4 },
                  textShadowRadius: 10,
                }}
              >
                {t('onboarding.connectGlove.title')}
              </Text>
              <Text 
                className="text-gray-300 text-base leading-6 font-inter-light"
              >
                {t('onboarding.connectGlove.subtitle')}
              </Text>
            </Animated.View>

            {/* Connection Status */}
            {isConnected && (
              <Animatable.View
                animation="bounceIn"
                duration={800}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
              >
                <Text className="text-green-300 font-inter-medium text-center">
                  ✅ Glove Connected Successfully!
                </Text>
              </Animatable.View>
            )}

            {/* Bottom Section */}
            <View className="flex-1 justify-end pb-8">
              <Animated.View entering={SlideInUp.delay(400)}>
                <Button
                  title={isConnecting ? 'Connecting...' : t('onboarding.connectGlove.button')}
                  onPress={handleConnectGlove}
                  variant="primary"
                  loading={isConnecting}
                  disabled={isConnected}
                />
                
                <TouchableOpacity 
                  onPress={handleSkipConnection}
                  className="mt-4"
                  disabled={isConnecting}
                >
                  <Text 
                    className="text-gray-400 font-inter-light text-center"
                    style={{
                      textShadowColor: '#d2981d',
                      textShadowOffset: { width: 0, height: 0.4 },
                      textShadowRadius: 10,
                    }}
                  >
                    {t('onboarding.connectGlove.discoverMore')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
