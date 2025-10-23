import { Check, Globe, Target, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/auth/AuthContext";
import "../../utils/i18n";

export default function BenefitsScreen({ navigation }: any) {
  const { completeOnboarding } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "Real-Time Translation",
      description:
        "Get instant translation of your sign language gestures into spoken text.",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description:
        "Communicate in multiple languages and break language barriers.",
    },
    {
      icon: Target,
      title: "High Precision",
      description:
        "High-precision gesture recognition for accurate communication.",
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
            <Text style={styles.title}>Why Signalink?</Text>
            <Text style={styles.subtitle}>
              Discover the features that make communication effortless
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <View style={styles.featureIconContainer}>
                    {React.createElement(feature.icon, {
                      size: 32,
                      color: "#f99f12",
                    })}
                  </View>

                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
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
            <View style={styles.exclusiveTitleContainer}>
              <Text style={styles.exclusiveTitle}>Exclusive Features</Text>
            </View>
            <View style={styles.exclusiveList}>
              <View style={styles.exclusiveItem}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.exclusiveText}>
                  Voice synthesis for audible communication
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.exclusiveText}>
                  Custom gesture learning and personalization
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.exclusiveText}>
                  Real-time chat integration
                </Text>
              </View>
              <View style={styles.exclusiveItem}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.exclusiveText}>
                  Social features and community
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.fixedButtonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="filled"
        />

        <Button title="Continue later" onPress={handleSkip} variant="text" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 120, // Space for fixed button
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "left",
    textShadowColor: "#d2981d",
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: "#D1D5DB",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "left",
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "transparent",
    padding: 16,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  featureDescription: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
  },
  exclusiveCard: {
    backgroundColor: "transparent",
    padding: 16,
    marginBottom: 32,
  },
  exclusiveTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",

    gap: 12,
  },
  exclusiveTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
  },
  exclusiveList: {
    marginTop: 16,
    gap: 8,
  },
  exclusiveItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  checkmark: {
    color: "#22C55E",
    marginRight: 8,
    fontSize: 16,
  },
  exclusiveText: {
    color: "#D1D5DB",
    fontSize: 14,
    flex: 1,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
    zIndex: 1000,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
