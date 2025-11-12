import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { login, loginAsGuest, isLoading, error, clearError } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
    // Simple validation
    const newErrors: any = {};
    if (!username) newErrors.username = t('login.usernameRequired');
    if (!password) newErrors.password = t('login.passwordRequired');
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    clearError();
    
    try {
      await login({ username, password });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('login.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('login.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.globalErrorText}>
                  {error}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('login.usernameLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.username && styles.inputError,
                    focusedInput === 'username' && styles.inputFocused
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder={t('login.usernamePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('login.passwordLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    focusedInput === 'password' && styles.inputFocused
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('login.passwordPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? t('login.signingIn') : t('login.signIn')}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  {t('login.noAccount')}
                </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.linkHighlight}>
                    {t('login.signUp')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.guestContainer}>
                <TouchableOpacity onPress={handleGuestLogin}>
                  <Text style={styles.guestText}>
                    {t('login.continueAsGuest')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.demoCard}>
              <Text style={styles.demoText}>
                {t('login.demoCredentials')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 24,
    alignItems: "flex-start",
  },
  form: {
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'left',
    textShadowColor: '#d2981d',
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'left',
    opacity: 0.9,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  globalErrorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 32,
  },
  inputParent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    color: '#ffffff',
    fontSize: 16,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: '#f99f12',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 48,
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#f99f12',
    fontSize: 14,
    fontWeight: '500',
  },
  guestContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  guestText: {
    color: '#9CA3AF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  demoCard: {
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
  },
  demoText: {
    color: 'rgba(249, 159, 18, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
});