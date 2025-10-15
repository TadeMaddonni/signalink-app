import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import '../../utils/i18n';

export default function HowItWorksScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: '🖐️',
      title: 'Wear the Glove',
      description: 'Put on the Signalink glove and ensure it\'s powered on',
    },
    {
      icon: '📱',
      title: 'Connect via Bluetooth',
      description: 'Connect the glove to your phone via Bluetooth',
    },
    {
      icon: '🗣️',
      title: 'Start Signing',
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
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              How It Works
            </Text>
            <Text style={styles.subtitle}>
              Learn how to use your Signalink glove in 3 simple steps
            </Text>
          </View>

          {/* Current Step Highlight */}
          <View style={styles.stepCard}>
            <View style={styles.stepContent}>
              <Text style={styles.stepIcon}>
                {steps[currentStep].icon}
              </Text>
              
              <Text style={styles.stepTitle}>
                {steps[currentStep].title}
              </Text>
              
              <Text style={styles.stepDescription}>
                {steps[currentStep].description}
              </Text>
            </View>
          </View>

          {/* Step Indicators */}
          <View style={styles.indicators}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentStep && styles.indicatorActive,
                  index < currentStep && styles.indicatorCompleted,
                ]}
              />
            ))}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${((currentStep + 1) / steps.length) * 100}%` }
                ]}
              />
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Next Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep === steps.length - 1 ? 'Continue' : 'Next'}
              </Text>
            </TouchableOpacity>
            
            {/* Previous Button */}
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrevious}
              >
                <Text style={styles.secondaryButtonText}>
                  Previous
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Skip All */}
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>
                Skip tutorial
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 32,
    marginBottom: 48,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 16,
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 18,
    lineHeight: 24,
  },
  stepCard: {
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#374151',
  },
  indicatorActive: {
    backgroundColor: '#f99f12',
  },
  indicatorCompleted: {
    backgroundColor: '#22C55E',
  },
  progressBarContainer: {
    marginBottom: 32,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f99f12',
    borderRadius: 4,
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
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
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
  },
});
