import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../src/components/ui/Button";
import "../src/utils/i18n"; // Initialize i18n

export default function OnboardingScreen() {
  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.title}>Bienvenido a Signalink!</Text>
          <Text style={styles.subtitle}>
            Conecta tu guante y comienza a comunicarte de manera única
          </Text>
        </Animated.View>

        {/* Glove Image */}
        <Image
          source={require("../assets/images/glove.png")}
          style={styles.gloveImage}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          {/* Login Button */}
          <Button
            text="Iniciar sesión"
            onPress={handleLogin}
            variant="primary"
          />
          {/* Register Button */}
          <Button
            text="Registrarse"
            onPress={handleRegister}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#000000",
    height: "100%",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 24,
  },
  gloveImage: {
    width: 405.33,
    height: 400.49,
    position: "absolute",
    objectFit: "cover",
    left: -50,
    zIndex: 1,
    top: "20%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    // Button positioned at bottom via justifyContent: space-between
  },
});
