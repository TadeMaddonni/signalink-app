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
import { UserType } from '../../types';
import '../../utils/i18n';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('regular_user');
  const [errors, setErrors] = useState<any>({});

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
          <View style={styles.form}>
            <View>
              <Text style={styles.title}>
                Create Account
              </Text>
              <Text style={styles.subtitle}>
                Join Signalink to communicate without barriers
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.globalErrorText}>
                  {error}
                </Text>
              </View>
            )}

            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Surname</Text>
                <TextInput
                  style={[styles.input, errors.surname && styles.inputError]}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder="Enter your last name"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                />
                {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>User Type</Text>
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
                      ]}>Regular User</Text>
                      <Text style={styles.userTypeDescription}>
                        Standard user account
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
                      ]}>Glove User</Text>
                      <Text style={styles.userTypeDescription}>
                        User with sign language glove
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Choose a username"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="default"
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
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
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 32,
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
    marginBottom: 16,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
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
    marginTop: 24,
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
  userTypeContainer: {
    gap: 12,
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  userTypeButtonActive: {
    borderColor: '#FFC452',
    backgroundColor: '#2D1F00',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#FFC452',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC452',
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
    color: '#FFC452',
  },
  userTypeDescription: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
