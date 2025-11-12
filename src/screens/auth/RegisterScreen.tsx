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
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/auth/AuthContext';
import { UserType } from '../../types';
import '../../utils/i18n';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [userType, setUserType] = useState<UserType>('regular_user');
  const [errors, setErrors] = useState<any>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    // Simple validation
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = t('register.nameRequired');
    if (!surname.trim()) newErrors.surname = t('register.surnameRequired');
    if (!username.trim()) newErrors.username = t('register.usernameRequired');
    else if (username.length < 3) newErrors.username = t('register.usernameTooShort');
    if (!email) newErrors.email = t('register.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('register.emailInvalid');
    if (!password) newErrors.password = t('register.passwordRequired');
    else if (password.length < 6) newErrors.password = t('register.passwordTooShort');
    if (!confirmPassword) newErrors.confirmPassword = t('register.confirmPasswordRequired');
    else if (password !== confirmPassword) newErrors.confirmPassword = t('register.passwordsMismatch');
    if (!language) newErrors.language = t('register.languageRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    clearError();

    try {
      await register({
        name,
        surname,
        username,
        email,
        password,
        confirmPassword,
        language,
        user_type: userType
      });
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
              {t('register.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('register.subtitle')}
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
                <Text style={styles.inputLabel}>{t('register.nameLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError,
                    focusedInput === 'name' && styles.inputFocused
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('register.namePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.surnameLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.surname && styles.inputError,
                    focusedInput === 'surname' && styles.inputFocused
                  ]}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder={t('register.surnamePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('surname')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.userTypeLabel')}</Text>
                <View style={styles.userTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      userType === 'regular_user' && styles.userTypeButtonActive,
                    ]}
                    onPress={() => setUserType('regular_user')}
                  >
                    <View style={[
                      styles.radioCircle,
                      userType === 'regular_user' && styles.radioCircleActive,
                    ]}>
                      {userType === 'regular_user' && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.userTypeTextContainer}>
                      <Text style={[
                        styles.userTypeTitle,
                        userType === 'regular_user' && styles.userTypeTitleActive,
                      ]}>{t('register.regularUser')}</Text>
                      <Text style={styles.userTypeDescription}>
                        {t('register.regularUserDesc')}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      userType === 'glove_user' && styles.userTypeButtonActive,
                    ]}
                    onPress={() => setUserType('glove_user')}
                  >
                    <View style={[
                      styles.radioCircle,
                      userType === 'glove_user' && styles.radioCircleActive,
                    ]}>
                      {userType === 'glove_user' && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.userTypeTextContainer}>
                      <Text style={[
                        styles.userTypeTitle,
                        userType === 'glove_user' && styles.userTypeTitleActive,
                      ]}>{t('register.gloveUser')}</Text>
                      <Text style={styles.userTypeDescription}>
                        {t('register.gloveUserDesc')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.usernameLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.username && styles.inputError,
                    focusedInput === 'username' && styles.inputFocused
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder={t('register.usernamePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.emailLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email && styles.inputError,
                    focusedInput === 'email' && styles.inputFocused
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('register.emailPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.languageLabel')}</Text>
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
                      {t('register.english')}
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
                      {t('register.spanish')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.language && <Text style={styles.errorText}>{errors.language}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.passwordLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    focusedInput === 'password' && styles.inputFocused
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('register.passwordPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.inputParent}>
                <Text style={styles.inputLabel}>{t('register.confirmPasswordLabel')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword && styles.inputError,
                    focusedInput === 'confirmPassword' && styles.inputFocused
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  autoCapitalize="none"
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
                  {isLoading ? t('register.creatingAccount') : t('register.createAccount')}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  {t('register.haveAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkHighlight}>
                    {t('register.signIn')}
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
  userTypeContainer: {
    gap: 12,
    width: '100%',
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    minHeight: 56,
  },
  userTypeButtonActive: {
    borderColor: '#f99f12',
    backgroundColor: '#111111',
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#f99f12',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f99f12',
  },
  userTypeTextContainer: {
    flex: 1,
  },
  userTypeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userTypeTitleActive: {
    color: '#f99f12',
  },
  userTypeDescription: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
