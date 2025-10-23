import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  style?: ViewStyle;
}

export default function ProgressIndicator({
  totalSteps,
  currentStep,
  style,
}: ProgressIndicatorProps) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep && styles.activeDot,
            index < currentStep && styles.completedDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#374151',
  },
  activeDot: {
    backgroundColor: '#f99f12',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  completedDot: {
    backgroundColor: '#f99f12',
    opacity: 0.7,
  },
});
