import React from 'react';
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
import '../../utils/i18n'; // Initialize i18n

export default function BenefitsScreen({ navigation }: any) {
  const { t } = useTranslation();

  const features = [
    {
      icon: '⚡',
      title: t('onboarding.benefits.feature1'),
      description: 'Get instant translation of your sign language gestures into spoken text.',
    },
    {
      icon: '🌍',
      title: t('onboarding.benefits.feature2'),
      description: 'Communicate in multiple languages and break language barriers.',
    },
    {
      icon: '🎯',
      title: t('onboarding.benefits.feature3'),
      description: 'High-precision gesture recognition for accurate communication.',
    },
  ];

  const handleGetStarted = () => {
    // Navigate to main app
    navigation.navigate('MainTabs');
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(200)} className="mt-8 mb-12">
            <Text 
              className="text-white text-3xl font-inter-medium mb-4 text-center"
              style={{
                textShadowColor: '#d2981d',
                textShadowOffset: { width: 0, height: 0.4 },
                textShadowRadius: 10,
              }}
            >
              {t('onboarding.benefits.title')}
            </Text>
            <Text className="text-gray-300 text-lg font-inter-light leading-6 text-center">
              {t('onboarding.benefits.subtitle')}
            </Text>
          </Animated.View>

          {/* Features */}
          <View className="space-y-6 mb-12">
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                entering={SlideInUp.delay(300 + index * 200)}
              >
                <Card variant="elevated" className="bg-gray-800/50 border border-gray-700">
                  <View className="flex-row items-center">
                    <Animatable.Text
                      animation="bounceIn"
                      delay={index * 150}
                      className="text-4xl mr-4"
                    >
                      {feature.icon}
                    </Animatable.Text>
                    
                    <View className="flex-1">
                      <Text className="text-white text-lg font-inter-medium mb-2">
                        {feature.title}
                      </Text>
                      <Text className="text-gray-300 font-inter-light leading-5">
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>

          {/* Additional Benefits */}
          <Animated.View entering={FadeInDown.delay(800)}>
            <Card variant="outlined" className="bg-primary-500/10 border border-primary-500/30">
              <View className="p-4">
                <Text className="text-primary-200 font-inter-medium text-lg mb-2 text-center">
                  ✨ Exclusive Features
                </Text>
                <View className="space-y-2 mt-4">
                  <View className="flex-row items-center">
                    <Text className="text-green-400 mr-2">✓</Text>
                    <Text className="text-gray-300 font-inter-light">
                      Voice synthesis for audible communication
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-400 mr-2">✓</Text>
                    <Text className="text-gray-300 font-inter-light">
                      Custom gesture learning and personalization
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-400 mr-2">✓</Text>
                    <Text className="text-gray-300 font-inter-light">
                      Real-time chat integration
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-400 mr-2">✓</Text>
                    <Text className="text-gray-300 font-inter-light">
                      Social features and community
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Bottom Section */}
          <View className="flex-1 justify-end pb-8 mt-8">
            <Animated.View entering={SlideInUp.delay(900)} className="space-y-4">
              <Button
                title="Get Started"
                onPress={handleGetStarted}
                variant="primary"
                size="lg"
              />
              
              <TouchableOpacity onPress={handleSkip}>
                <Text className="text-gray-400 font-inter-light text-center">
                  Continue later
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
