import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

export default function BenefitsScreen({ navigation }: any) {
  const { completeOnboarding } = useAuth();
  
  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Translation',
      description: 'Get instant translation of your sign language gestures into spoken text.',
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Communicate in multiple languages and break language barriers.',
    },
    {
      icon: '🎯',
      title: 'High Precision',
      description: 'High-precision gesture recognition for accurate communication.',
    },
  ];

  const handleGetStarted = () => {
    // Mark onboarding as complete
    completeOnboarding();
  };

  const handleSkip = () => {
    // Mark onboarding as complete
    completeOnboarding();
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
              Why Signalink?
            </Text>
            <Text style={styles.subtitle}>
              Discover the features that make communication effortless
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <Text style={styles.featureIcon}>
                    {feature.icon}
                  </Text>
                  
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>
                      {feature.title}
                    </Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Additional Benefits */}
          <View style={styles.exclusiveCard}>
            <Text style={styles.exclusiveTitle}>
              ✨ Exclusive Features
            </Text>
            <View style={styles.exclusiveList}>
              <View style={styles.exclusiveItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.exclusiveText}>
                  Voice synthesis for audible communication
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.exclusiveText}>
                  Custom gesture learning and personalization
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.exclusiveText}>
                  Real-time chat integration
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.exclusiveText}>
                  Social features and community
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>
                Get Started
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>
                Continue later
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
    textAlign: 'center',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  exclusiveCard: {
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  exclusiveTitle: {
    color: 'rgba(249, 159, 18, 0.9)',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  exclusiveList: {
    marginTop: 16,
    gap: 8,
  },
  exclusiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#22C55E',
    marginRight: 8,
    fontSize: 16,
  },
  exclusiveText: {
    color: '#D1D5DB',
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
    marginTop: 32,
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
