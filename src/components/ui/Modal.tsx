import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ReactNode } from 'react';

const { height: screenHeight } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(screenHeight, {
        damping: 20,
        stiffness: 100,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={backdropStyle}
        className="flex-1 bg-black/50 justify-end"
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={modalStyle}
          className="bg-gray-900 rounded-t-3xl px-6 pb-safe-bottom pt-6 max-h-3/4"
        >
          {showCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              className="items-end mb-4"
            >
              <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center">
                <Text className="text-white text-lg font-medium">×</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {title && (
            <Text className="text-white font-inter-medium text-xl mb-6 text-center">
              {title}
            </Text>
          )}
          
          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};
