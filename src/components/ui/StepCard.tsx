import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive?: boolean;
  style?: ViewStyle;
}

export default function StepCard({
  icon: Icon,
  title,
  description,
  isActive = false,
  style,
}: StepCardProps) {
  return (
    <View style={[
      styles.container,
      isActive && styles.activeContainer,
      style
    ]}>
      <View style={styles.content}>
        <View style={[
          styles.iconContainer,
          isActive && styles.activeIconContainer
        ]}>
          <Icon 
            size={56} 
            color={isActive ? '#f99f12' : '#6B7280'} 
          />
        </View>
        
        <Text style={[
          styles.title,
          isActive && styles.activeTitle
        ]}>
          {title}
        </Text>
        
        <Text style={[
          styles.description,
          isActive && styles.activeDescription
        ]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  activeContainer: {
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(75, 85, 99, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(249, 159, 18, 0.15)',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    color: '#9CA3AF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  activeTitle: {
    color: '#ffffff',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 8,
  },
  description: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  activeDescription: {
    color: '#D1D5DB',
  },
});
