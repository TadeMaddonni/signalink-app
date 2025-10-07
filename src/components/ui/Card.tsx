import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  onPress,
  variant = 'default',
  className = '',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-gray-800 shadow-lg shadow-black/50';
      case 'outlined':
        return 'bg-transparent border border-gray-700';
      default:
        return 'bg-gray-800';
    }
  };

  const CardComponent = onPress ? AnimatedPressable : AnimatedView;
  const pressableProps = onPress ? {
    onPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  } : {};

  return (
    <CardComponent
      {...pressableProps}
      style={[onPress ? animatedStyle : undefined]}
      className={`
        ${getVariantStyles()}
        rounded-2xl p-4
        ${className}
      `}
    >
      {(title || subtitle) && (
        <View className="mb-3">
          {title && (
            <Text className="text-white font-inter-medium text-lg mb-1">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-gray-400 font-inter-light text-sm">
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children}
    </CardComponent>
  );
};
