import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuth } from '../../src/contexts/auth/AuthContext';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!credentials.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!credentials.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!credentials.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await register(credentials);
      router.replace('/(tabs)'); // Navigate to main app after registration
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View>
              <Text className="text-white text-3xl mb-2 font-semibold">
                Create Account
              </Text>
              <Text className="text-gray-400 mb-8">
                Join Signalink to communicate without barriers
              </Text>
            </View>

            {/* Global error */}
            {error && (
              <View className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <Text className="text-red-300 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Form */}
            <View>
              <Input
                label="Name"
                value={credentials.name}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, name: text }))
                }
                placeholder="Enter your name"
                keyboardType="default"
                leftIcon="👤"
                error={fieldErrors.name}
              />

              <Input
                label="Email"
                value={credentials.email}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, email: text }))
                }
                placeholder="Enter your email"
                keyboardType="email-address"
                leftIcon="✉️"
                error={fieldErrors.email}
              />

              <Input
                label="Password"
                value={credentials.password}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, password: text }))
                }
                placeholder="Enter your password"
                secureTextEntry={true}
                leftIcon="🔒"
                error={fieldErrors.password}
              />

              <Input
                label="Confirm Password"
                value={credentials.confirmPassword}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, confirmPassword: text }))
                }
                placeholder="Confirm your password"
                secureTextEntry={true}
                leftIcon="🔒"
                error={fieldErrors.confirmPassword}
              />
            </View>

            {/* Register Button */}
            <View>
              <Button
                title="Create Account"
                onPress={handleRegister}
                variant="primary"
                loading={isLoading}
              />
            </View>

            {/* Login Link */}
            <View>
              <View className="flex-row justify-center items-center mt-6 space-x-2">
                <Text className="text-gray-400 text-sm">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text className="text-orange-500 font-medium text-sm">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
