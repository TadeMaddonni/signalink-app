import { BarChart3, ChevronRight, Globe, HelpCircle, Settings, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const profileOptions = [
    {
      id: 'glove',
      title: 'Glove Settings',
      subtitle: 'Configure your Signalink glove preferences',
      icon: Settings,
      onPress: () => console.log('Glove Settings'),
    },
    {
      id: 'language',
      title: 'Language Settings',
      subtitle: 'Choose your preferred translation language',
      icon: Globe,
      onPress: () => console.log('Language Settings'),
    },
    {
      id: 'statistics',
      title: 'Statistics',
      subtitle: 'View your translation statistics and progress',
      icon: BarChart3,
      onPress: () => console.log('Statistics'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Manage your account and preferences
            </Text>
          </View>

          {/* Profile Card */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={40} color="#f99f12" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                  {user?.name || 'User'}
                </Text>
                <Text style={styles.userEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Settings Options */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={styles.optionsList}>
                {profileOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionItem}
                    onPress={option.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionIcon}>
                        <option.icon size={24} color="#f99f12" />
                      </View>
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                      </View>
                      <ChevronRight size={20} color="#6B7280" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <View style={styles.logoutSection}>
              <Button
                title="Sign Out"
                onPress={handleLogout}
                variant="outline"
              />
            </View>
          </Animated.View>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
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
  profileCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },
  logoutSection: {
    marginTop: 16,
    marginBottom: 32,
  },
});
