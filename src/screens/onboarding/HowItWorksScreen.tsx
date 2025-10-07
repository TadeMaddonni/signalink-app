import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import '../../utils/i18n'; // Initialize i18n

const { width: screenWidth } = Dimensions.get('window');

export default function HowItWorksScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: '🖐️',
      title: t('onboarding.howItWorks.step1'),
      description: 'Put on the Signalink glove and ensure it\'s powered on',
    },
    {
      icon: '📱',
      title: t('onboarding.howItWorks.step2'),
      description: 'Connect the glove to your phone via Bluetooth',
    },
    {
      icon: '🗣️',
      title: t('onboarding.howItWorks.step3'),
      description: 'Start signing and watch your gestures turn into speech',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Benefits');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Benefits');
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
              className="text-white text-3xl font-inter-medium mb-4"
              style={{
                textShadowColor: '#d2981d',
                textShadowOffset: { width: 0, height: 0.4 },
                textShadowRadius: 10,
              }}
            >
              {t('onboarding.howItWorks.title')}
            </Text>
            <Text className="text-gray-300 text-lg font-inter-light leading-6">
              {t('onboarding.howItWorks.subtitle')}
            </Text>
          </Animated.View>

          {/* Current Step Highlight */}
          <Animated.View 
            entering={SlideInLeft.delay(300)}
            className="mb-8"
          >
            <Card variant="elevated" className="bg-gradient-to-r from-primary-500/20 to-green-500/20 border border-primary-500/30">
              <View className="items-center py-8">
                <Animatable.Text
                  animation={currentStep === 0 ? 'bounce' : 'fadeIn'}
                  duration={500}
                  className="text-6xl mb-4"
                >
                  {steps[currentStep].icon}
                </Animatable.Text>
                
                <Animatable.Text
                  key={currentStep}
                  animation="fadeInUp"
                  duration={400}
                  className="text-white text-xl font-inter-medium mb-3 text-center"
                >
                  {steps[currentStep].title}
                </Animatable.Text>
                
                <Animatable.Text
                  key={`desc-${currentStep}`}
                  animation="fadeInUp"
                  duration={500}
                  className="text-gray-300 text-center font-inter-light leading-6"
                >
                  {steps[currentStep].description}
                </Animatable.Text>
              </View>
            </Card>
          </Animated.View>

          {/* Step Indicators */}
          <Animated.View 
            entering={SlideInRight.delay(400)}
            className="flex-row justify-center mb-8 space-x-3"
          >
            {steps.map((_, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep 
                    ? 'bg-primary-500' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-700'
                }`}
              />
            ))}
          </Animated.View>

          {/* Progress Bar */}
          <Animated.View 
            entering={SlideInLeft.delay(500)}
            className="mb-8"
          >
            <View className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <Animatable.View
                animation={{
                  0: { width: '0%' },
                  1: { width: `${((currentStep + 1) / steps.length) * 100}%` },
                }}
                duration={500}
                className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full"
                transition="width"
              />
            </View>
          </Animated.View>

          {/* Navigation Buttons */}
          <View className="flex-1 justify-end pb-8">
            <Animated.View entering={FadeInDown.delay(600)} className="space-y-4">
              {/* Next/Skip Button */}
              <Button
                title={currentStep === steps.length - 1 ? t('onboarding.common.skip') : t('onboarding.common.next')}
                onPress={handleNext}
                variant="primary"
              />
              
              {/* Previous Button */}
              {currentStep > 0 && (
                <Button
                  title={t('onboarding.common.previous')}
                  onPress={handlePrevious}
                  variant="outline"
                />
              )}
              
              {/* Skip All */}
              <TouchableOpacity onPress={handleSkip}>
                <Text className="text-gray-400 font-inter-light text-center">
                  Skip tutorial
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
