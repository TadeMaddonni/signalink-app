import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Card } from '../../components/ui/Card';
import '../../utils/i18n';

export default function ExploreScreen() {
  const { t } = useTranslation();

  const categories = [
    {
      icon: '👥',
      title: 'Sign Language Community',
      description: 'Connect with others learning sign language',
    },
    {
      icon: '🎓',
      title: 'Learning Resources',
      description: 'Practice and improve your signing skills',
    },
    {
      icon: '🏆',
      title: 'Challenges & Games',
      description: 'Engage with interactive sign language games',
    },
    {
      icon: '📖',
      title: 'Sign Dictionary',
      description: 'Browse our comprehensive sign library',
    },
  ];

  const renderCategory = ({ item, index }: { item: any; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 150}
      className="mb-4"
    >
      <Card variant="elevated" className="bg-gradient-to-r from-gray-800 to-gray-700">
        <View className="flex-row items-center p-4">
          <Text className="text-4xl mr-4">{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-white font-inter-medium text-lg mb-2">
              {item.title}
            </Text>
            <Text className="text-gray-300 font-inter-light">
              {item.description}
            </Text>
          </View>
        </View>
      </Card>
    </Animatable.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6">
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className="text-white text-2xl font-inter-medium mb-2">
              Explore Signalink
            </Text>
            <Text className="text-gray-400 font-inter-light mb-6">
              Discover features and resources to enhance your experience
            </Text>
          </Animated.View>

          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.title}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
