import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  style,
}: ProgressBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.background}>
        <View 
          style={[
            styles.fill,
            { width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  background: {
    width: '100%',
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#f99f12',
    borderRadius: 3,
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});
