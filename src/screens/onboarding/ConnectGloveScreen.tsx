import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckCircle } from "lucide-react-native";
import Button from "../../components/ui/Button";
import { BluetoothService } from "../../services/bluetooth/BluetoothService";
import "../../utils/i18n";

export default function ConnectGloveScreen({ navigation }: any) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectGlove = async () => {
    setIsConnecting(true);

    try {
      const bluetoothService = BluetoothService.getInstance();
      await bluetoothService.initialize();

      const success = await bluetoothService.connectToDevice("signalink-001");

      if (success) {
        setIsConnected(true);
        // Navigate to next screen after a delay
        setTimeout(() => {
          navigation.navigate("HowItWorks");
        }, 1500);
      } else {
        // Show error or retry
        setIsConnecting(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
    }
  };

  const handleSkipConnection = () => {
    navigation.navigate("HowItWorks");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Connect Your Glove</Text>
            <Text style={styles.subtitle}>
              Turn on your Signalink glove and tap the button below to connect
              via Bluetooth
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Glove Image */}
            <View style={styles.gloveContainer}>
              <Image
                source={require("../../../assets/images/glove.png")}
                style={styles.gloveImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            {/* Connection Status */}
            {isConnected && (
              <View style={styles.successCard}>
                <View style={styles.successContent}>
                  <CheckCircle size={20} color="#86EFAC" />
                  <Text style={styles.successText}>
                    Glove Connected Successfully!
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom Section */}
            <View style={styles.buttonsContainer}>
              <Button
                title={isConnecting
                  ? "Connecting..."
                  : isConnected
                  ? "Connected"
                  : "Connect Glove"}
                onPress={handleConnectGlove}
                variant="filled"
                disabled={isConnecting || isConnected}
              />

              <Button
                title="Skip for now"
                onPress={handleSkipConnection}
                variant="text"
                disabled={isConnecting}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  content: {
    flex: 1,
  },
  gloveContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: 400,
    position: "relative",
  },
  glovePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(249, 159, 18, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(249, 159, 18, 0.3)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  gloveImage: {
    width: "100%",
    height: 600,
    objectFit: "cover",
    marginBottom: 8,
    position: "absolute",
    top: "-30%",
    left: "-10%",
  },
  gloveLabel: {
    color: "#ffffff",
    fontSize: 16,
  },
  textContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textShadowColor: "#d2981d",
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 24,
  },
  successCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: "#86EFAC",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 32,
    gap: 16,
  },
});
