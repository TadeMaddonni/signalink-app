import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
}) => {

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'bg-white rounded-3xl shadow-lg',
          text: 'text-black',
          shadow: 'shadow-[0px_0.3px_24px_rgba(222,120,28,0.15)]',
        };
      case 'secondary':
        return {
          container: 'bg-primary-500 rounded-3xl',
          text: 'text-white',
          shadow: 'shadow-lg',
        };
      case 'outline':
        return {
          container: 'border border-primary-500 rounded-3xl bg-transparent',
          text: 'text-primary-500',
          shadow: '',
        };
      default:
        return {
          container: 'bg-white rounded-3xl shadow-lg',
          text: 'text-black',
          shadow: 'shadow-[0px_0.3px_24px_rgba(222,120,28,0.15)]',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-10 px-4',
          text: 'text-sm',
        };
      case 'md':
        return {
          container: 'h-12 px-6',
          text: 'text-base',
        };
      case 'lg':
        return {
          container: 'h-14 px-8',
          text: 'text-lg',
        };
      default:
        return {
          container: 'h-12 px-6',
          text: 'text-base',
        };
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      className={`${styles.container} ${styles.shadow} ${sizeStyles.container} ${
        disabled ? 'opacity-50' : ''
      } justify-center items-center`}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
    >
      <View className="flex-row items-center justify-center space-x-2">
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#000000' : '#ffffff'} 
          />
        ) : (
          <>
            <Text className={`${styles.text} ${sizeStyles.text} font-inter-medium`}>
              {title}
            </Text>
            {icon && <Text className="text-lg">{icon}</Text>}
          </>
        )}
      </View>
    </Pressable>
  );
};
