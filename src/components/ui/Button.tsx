import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type ButtonVariant = 'filled' | 'outline' | 'text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle[] = [styles.baseButton];
    
    switch (variant) {
      case 'filled':
        baseStyle.push(styles.filledButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'text':
        baseStyle.push(styles.textButton);
        break;
    }
    
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return StyleSheet.flatten(baseStyle);
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle[] = [styles.baseText];
    
    switch (variant) {
      case 'filled':
        baseTextStyle.push(styles.filledText);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
      case 'text':
        baseTextStyle.push(styles.textText);
        break;
    }
    
    if (disabled) {
      baseTextStyle.push(styles.textDisabled);
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return StyleSheet.flatten(baseTextStyle);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filledButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  filledText: {
    color: '#000000',
  },
  outlineText: {
    color: '#ffffff',
  },
  textText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 10,
  },
  textDisabled: {
    opacity: 0.5,
  },
});