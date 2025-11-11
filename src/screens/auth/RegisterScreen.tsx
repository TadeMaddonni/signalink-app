import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [errors, setErrors] = useState<any>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    // Simple validation
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!surname.trim()) newErrors.surname = 'Surname is required';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!language) newErrors.language = 'Language is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    clearError();

    try {
      await register({ name, surname, username, email, password, confirmPassword, language });
    } catch (error) {
      console.error('Register error:', error);
    }
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
              Create Account
            </Text>
            <Text style={styles.subtitle}>
              Join Signalink to communicate without barriers
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
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError,
                    focusedInput === 'name' && styles.inputFocused
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Surname</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.surname && styles.inputError,
                    focusedInput === 'surname' && styles.inputFocused
                  ]}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder="Enter your last name"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  onFocus={() => setFocusedInput('surname')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.username && styles.inputError,
                    focusedInput === 'username' && styles.inputFocused
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Choose a username"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email && styles.inputError,
                    focusedInput === 'email' && styles.inputFocused
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Language</Text>
                <View style={styles.languageSelector}>
                  <TouchableOpacity
                    style={[
                      styles.languageButton,
                      language === 'en' && styles.languageButtonActive
                    ]}
                    onPress={() => setLanguage('en')}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      language === 'en' && styles.languageButtonTextActive
                    ]}>
                      English
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.languageButton,
                      language === 'es' && styles.languageButtonActive
                    ]}
                    onPress={() => setLanguage('es')}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      language === 'es' && styles.languageButtonTextActive
                    ]}>
                      Español
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.language && <Text style={styles.errorText}>{errors.language}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    focusedInput === 'password' && styles.inputFocused
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword && styles.inputError,
                    focusedInput === 'confirmPassword' && styles.inputFocused
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkHighlight}>
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
    alignItems: 'flex-start',
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
  languageSelector: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#f99f12',
    borderColor: '#f99f12',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  languageButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
});
