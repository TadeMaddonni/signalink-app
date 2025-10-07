import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { useAuth } from '../../contexts/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RegisterCredentials } from '../../types';
import '../../utils/i18n'; // Initialize i18n

export default function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!credentials.name.trim()) {
      errors.name = t('errors.validationError');
    }
    
    if (!credentials.email) {
      errors.email = t('errors.validationError');
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!credentials.password) {
      errors.password = t('errors.validationError');
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!credentials.confirmPassword) {
      errors.confirmPassword = t('errors.validationError');
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = t('errors.validationError');
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await register(credentials);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            {/* Background glow effect */}
            <Animated.View
              entering={FadeIn.delay(200)}
              className="absolute top-20 right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"
            />
            
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <Text className="text-white font-inter-medium text-3xl mb-2">
                {t('register.title')}
              </Text>
              <Text className="text-gray-400 font-inter-light text-base mb-8">
                {t('register.subtitle')}
              </Text>
            </Animated.View>

            {/* Global error */}
            {error && (
              <Animatable.View
                animation="shake"
                duration={500}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <Text className="text-red-300 font-inter-light text-sm text-center">
                  {error}
                </Text>
              </Animatable.View>
            )}

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <Input
                label={t('register.namePlaceholder')}
                value={credentials.name}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, name: text }))
                }
                placeholder={t('register.namePlaceholder')}
                keyboardType="default"
                leftIcon="👤"
                error={fieldErrors.name}
              />

              <Input
                label={t('register.emailPlaceholder')}
                value={credentials.email}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, email: text }))
                }
                placeholder={t('register.emailPlaceholder')}
                keyboardType="email-address"
                leftIcon="✉️"
                error={fieldErrors.email}
              />

              <Input
                label={t('register.passwordPlaceholder')}
                value={credentials.password}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, password: text }))
                }
                placeholder={t('register.passwordPlaceholder')}
                secureTextEntry={true}
                leftIcon="🔒"
                error={fieldErrors.password}
              />

              <Input
                label={t('register.confirmPasswordPlaceholder')}
                value={credentials.confirmPassword}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, confirmPassword: text }))
                }
                placeholder={t('register.confirmPasswordPlaceholder')}
                secureTextEntry={true}
                leftIcon="🔒"
                error={fieldErrors.confirmPassword}
              />
            </Animated.View>

            {/* Register Button */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <Button
                title={t('register.registerButton')}
                onPress={handleRegister}
                variant="primary"
                loading={isLoading}
              />
            </Animated.View>

            {/* Login Link */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <View className="flex-row justify-center items-center mt-6 space-x-2">
                <Text className="text-gray-400 font-inter-light text-sm">
                  {t('register.loginLink')}
                </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text className="text-primary-500 font-inter-medium text-sm">
                    {t('login.loginButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
