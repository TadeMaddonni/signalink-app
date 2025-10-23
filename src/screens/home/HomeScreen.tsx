import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Bluetooth,
  BookOpen,
  ChevronRight,
  Circle,
  MessageSquare,
  Settings,
  Users,
  Volume2,
} from "lucide-react-native";
import { BluetoothService } from "../../services/bluetooth/BluetoothService";
import "../../utils/i18n";

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);

  const bluetoothService = BluetoothService.getInstance();

  React.useEffect(() => {
    setIsConnected(bluetoothService.isConnected());

    if (bluetoothService.isConnected()) {
      bluetoothService.startDataStream();
    }
  }, []);

  const handleConnectGlove = async () => {
    await bluetoothService.connectToDevice("signalink-001");
    setIsConnected(bluetoothService.isConnected());
    setBatteryLevel(Math.floor(Math.random() * 40) + 60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Home</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Settings size={20} color="#ffffff" />
              </TouchableOpacity>

            </View>
          </View>

          {/* Grid Cards */}
          <View style={styles.gridContainer}>
            {/* Glove Status - Full Width */}
            <TouchableOpacity style={styles.fullWidthCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Circle
                    size={20}
                    color={isConnected ? "#22C55E" : "#EF4444"}
                    fill={isConnected ? "#22C55E" : "#EF4444"}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Glove Status</Text>
                  <Text style={styles.cardSubtitle}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* First Row - Two Column Cards */}
            <View style={styles.row}>
              {/* Voice Translation Mode */}
              <TouchableOpacity style={styles.halfWidthCard}>
                <View style={styles.halfCardContent}>
                  <View style={styles.halfCardIconContainer}>
                    <Volume2 size={24} color="#f99f12" />
                  </View>
                  <View style={styles.halfCardTextContainer}>
                    <Text style={styles.halfCardTitle}>Voice Mode</Text>
                    <Text style={styles.halfCardSubtitle}>Active</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Signs Library */}
              <TouchableOpacity style={styles.halfWidthCard}>
                <View style={styles.halfCardContent}>
                  <View style={styles.halfCardIconContainer}>
                    <BookOpen size={24} color="#f99f12" />
                  </View>
                  <View style={styles.halfCardTextContainer}>
                    <Text style={styles.halfCardTitle}>Signs Library</Text>
                    <Text style={styles.halfCardSubtitle}>Learn gestures</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Second Row - Two Column Cards */}
            <View style={styles.row}>
              {/* Groups */}
              <TouchableOpacity style={styles.halfWidthCard}>
                <View style={styles.halfCardContent}>
                  <View style={styles.halfCardIconContainer}>
                    <Users size={24} color="#f99f12" />
                  </View>
                  <View style={styles.halfCardTextContainer}>
                    <Text style={styles.halfCardTitle}>Groups</Text>
                    <Text style={styles.halfCardSubtitle}>Chat on groupss</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Receptor Buddy */}
              <TouchableOpacity style={styles.halfWidthCard}>
                <View style={styles.halfCardContent}>
                  <View style={styles.halfCardIconContainer}>
                    <MessageSquare size={24} color="#f99f12" />
                  </View>
                  <View style={styles.halfCardTextContainer}>
                    <Text style={styles.halfCardTitle}>Buddy</Text>
                    <Text style={styles.halfCardSubtitle}>Find near people</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Custom Calibration - Full Width */}
            <TouchableOpacity style={styles.fullWidthCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Bluetooth size={20} color="#f99f12" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Custom Calibration</Text>
                  <Text style={styles.cardSubtitle}>Calibrate your glove</Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* Add New Card - Full Width */}
            {/* <TouchableOpacity style={[styles.fullWidthCard, styles.addCard]}>
              <View style={styles.addCardContent}>
                <Text style={styles.addCardIcon}>+</Text>
              </View>
            </TouchableOpacity> */}
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
  scrollContent: {
    paddingBottom: 100, // Space for floating tab bar
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "300",
  },
  gridContainer: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    minHeight: 100,
  },
  halfWidthCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    minHeight: 100,
  },
  fullWidthCard: {
    width: "100%",
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(249, 159, 18, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  halfCardContent: {
    flex: 1,
    position: "relative",
  },
  halfCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249, 159, 18, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  halfCardTextContainer: {
    flex: 1,
  },
  halfCardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  halfCardSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  addCard: {
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(75, 85, 99, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addCardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  addCardIcon: {
    color: "#6B7280",
    fontSize: 32,
    fontWeight: "300",
  },
});
