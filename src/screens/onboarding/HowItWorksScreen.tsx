import { Hand, Mic, Smartphone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import StepCard from '../../components/ui/StepCard';
import '../../utils/i18n';

export default function HowItWorksScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Hand,
      title: 'Wear the Glove',
      description: 'Put on the Signalink glove and ensure it\'s powered on',
    },
    {
      icon: Smartphone,
      title: 'Connect via Bluetooth',
      description: 'Connect the glove to your phone via Bluetooth',
    },
    {
      icon: Mic,
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
      {/* Progress Bar - Fixed at top */}
      <ProgressBar progress={(currentStep + 1) / steps.length} />
      
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

          {/* Current Step Card */}
          <StepCard
            icon={steps[currentStep].icon}
            title={steps[currentStep].title}
            description={steps[currentStep].description}
            isActive={true}
          />

          {/* Step Indicators */}
          <ProgressIndicator 
            totalSteps={steps.length}
            currentStep={currentStep}
          />

          {/* Navigation Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Next Button */}
            <Button
              title={currentStep === steps.length - 1 ? 'Continue' : 'Next'}
              onPress={handleNext}
              variant="filled"
            />
            
            {/* Previous Button */}
            {currentStep > 0 && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
              />
            )}
            
            {/* Skip All */}
            <Button
              style={styles.skipButton}
              title="Skip tutorial"
              onPress={handleSkip}
              variant="text"
            />
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
    marginTop: 24,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'left',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'left',
    opacity: 0.9,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});
