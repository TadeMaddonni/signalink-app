import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6">
          <Animated.View entering={FadeInDown.delay(100)}>
            {/* Profile Header */}
            <Card variant="elevated" className="bg-gradient-to-r from-primary-500/20 to-green-500/20 border border-primary-500/30">
              <View className="items-center p-6">
                <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
                  <Text className="text-white text-2xl">👤</Text>
                </View>
                <Text className="text-white text-xl font-inter-medium mb-2">
                  {user?.name || 'User'}
                </Text>
                <Text className="text-gray-400 font-inter-light">
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Profile Options */}
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <Text className="text-white text-lg font-inter-medium mb-4">
              Settings
            </Text>
            
            <View className="space-y-3">
              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center p-4">
                    <Text className="text-2xl mr-4">🔧</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg">
                        Glove Settings
                      </Text>
                      <Text className="text-gray-400 font-inter-light">
                        Configure your Signalink glove preferences
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center p-4">
                    <Text className="text-2xl mr-4">🌍</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg">
                        Language Settings
                      </Text>
                      <Text className="text-gray-400 font-inter-light">
                        Choose your preferred translation language
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center p-4">
                    <Text className="text-2xl mr-4">📊</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg">
                        Statistics
                      </Text>
                      <Text className="text-gray-400 font-inter-light">
                        View your translation statistics and progress
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card variant="elevated">
                  <View className="flex-row items-center p-4">
                    <Text className="text-2xl mr-4">❓</Text>
                    <View className="flex-1">
                      <Text className="text-white font-inter-medium text-lg">
                        Help & Support
                      </Text>
                      <Text className="text-gray-400 font-inter-light">
                        Get help and contact support
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View entering={FadeInDown.delay(300)} className="mt-8">
            <Button
              title="Sign Out"
              onPress={handleLogout}
              variant="outline"
              size="lg"
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
