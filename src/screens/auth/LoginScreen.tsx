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
import { LoginCredentials } from '../../types';
import '../../utils/i18n'; // Initialize i18n

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { login, isLoading, clearError } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
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
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
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
                {t('login.title')}
              </Text>
              <Text className="text-gray-400 font-inter-light text-base mb-8">
                {t('login.subtitle')}
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <Input
                label={t('login.emailPlaceholder')}
                value={credentials.email}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, email: text }))
                }
                placeholder={t('login.emailPlaceholder')}
                keyboardType="email-address"
                leftIcon="✉️"
                error={fieldErrors.email}
              />

              <Input
                label={t('login.passwordPlaceholder')}
                value={credentials.password}
                onChangeText={(text) => 
                  setCredentials(prev => ({ ...prev, password: text }))
                }
                placeholder={t('login.passwordPlaceholder')}
                secureTextEntry={true}
                leftIcon="🔒"
                error={fieldErrors.password}
              />
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <Button
                title={t('login.loginButton')}
                onPress={handleLogin}
                variant="primary"
                loading={isLoading}
              />
            </Animated.View>

            {/* Forgot Password */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <TouchableOpacity className="items-center mt-4">
                <Text className="text-primary-500 font-inter-light text-sm">
                  {t('login.forgotPassword')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <Animated.View entering={FadeInDown.delay(500)}>
              <View className="flex-row justify-center items-center mt-6 space-x-2">
                <Text className="text-gray-400 font-inter-light text-sm">
                  {t('login.registerLink')}
                </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text className="text-primary-500 font-inter-medium text-sm">
                    {t('register.registerButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Demo credentials hint */}
            <Animatable.View
              animation="bounceIn"
              iterationCount={1}
              delay={650}
              duration={600}
              className="mt-8 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
            >
              <Text className="text-primary-200 font-inter-light text-sm text-center">
                Demo credentials:{'\n'}
                Email: test@example.com{'\n'}
                Password: 123456
              </Text>
            </Animatable.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
