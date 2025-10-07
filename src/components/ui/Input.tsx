import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  leftIcon,
  rightIcon,
}) => {

  return (
    <View className="w-full mb-4">
      <Text className="text-white font-inter-medium text-base mb-2">
        {label}
      </Text>
      
      <TextInput
        className={`
          bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 
          text-white font-inter-light text-base
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${leftIcon ? 'pl-12' : ''}
          ${rightIcon ? 'pr-12' : ''}
        `}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      
      {leftIcon && (
        <View className="absolute left-4 top-9 z-10">
          <Text className="text-gray-400 text-lg">{leftIcon}</Text>
        </View>
      )}
      
      {rightIcon && (
        <TouchableOpacity className="absolute right-4 top-9 z-10">
          <Text className="text-gray-400 text-lg">{rightIcon}</Text>
        </TouchableOpacity>
      )}
      
      {error && (
        <Text className="text-red-500 font-inter-light text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};
