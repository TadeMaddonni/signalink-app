import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import { Button } from "../../src/components/ui/Button";
import { BluetoothService } from "../../src/services/bluetooth/BluetoothService";
import "../../src/utils/i18n"; // Initialize i18n

export default function TabTwoScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel] = useState(85);

  const bluetoothService = BluetoothService.getInstance();
  React.useEffect(() => {
    setIsConnected(bluetoothService.isConnected());

    if (bluetoothService.isConnected()) {
      bluetoothService.startDataStream();
    }
  }, []);

  const handleWithGlove = async () => {
    router.push("/auth/login");
  };

  const handleWithoutGlove = async () => {
    router.push("/(tabs)/explore");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.title}>Bienvenido a Signalink!</Text>
          <Text style={styles.subtitle}>
            Bienvenido a la app de Signalink, te esperamos para que puedas comunicarte 
          </Text>
        </Animated.View>

        {/* Glove Image */}
        <Image
          source={require("../../assets/images/glove.png")}
          style={styles.gloveImage}
          resizeMode="contain"
        />

        <View style={styles.connectButtonContainer}>
          {/* has glove */}
          <Button
            text="Tengo guante Signalink"
            onPress={handleWithGlove}
            variant="primary"
          />
          {/* Don't has glove */}
          <Button
            text="No tengo guante Signalink"
            onPress={handleWithoutGlove}
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
  connectButtonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    // Button positioned at bottom via justifyContent: space-between
  },
});
