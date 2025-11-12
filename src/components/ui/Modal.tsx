import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, Dimensions, StyleSheet } from 'react-native';
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
        style={[backdropStyle, modalStyles.backdrop]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[modalStyle, modalStyles.modalContainer]}
        >
          {showCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              style={modalStyles.closeButtonContainer}
            >
              <View style={modalStyles.closeButton}>
                <Text style={modalStyles.closeButtonText}>×</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {title && (
            <Text style={modalStyles.title}>
              {title}
            </Text>
          )}
          
          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#111827', // gray-900
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    maxHeight: '75%',
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151', // gray-700
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  title: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
});
