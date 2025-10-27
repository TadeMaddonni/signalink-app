// User Types
export interface User {
  id: number;
  name: string;
  surname?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Login success response
export interface LoginSuccessResponse {
  success: true;
  message: string;
  user: {
    id: number;
    name: string;
  };
}

// Register success response  
export interface RegisterSuccessResponse {
  success: true;
  message: string;
  user_id: number;
}

// Error response
export interface ApiErrorResponse {
  error: string;
}

// Union types for API responses
export type LoginResponse = LoginSuccessResponse | ApiErrorResponse;
export type RegisterResponse = RegisterSuccessResponse | ApiErrorResponse;

// Sign Language Translation Types
export interface SignData {
  id: string;
  gesture: string;
  translation: string;
  confidence: number;
  timestamp: Date;
}

export interface TranslationResult {
  text: string;
  language: string;
  confidence: number;
}

// Bluetooth Device Types
export interface BluetoothDevice {
  id: string;
  name: string;
  isConnected: boolean;
  signalStrength: number;
  lastConnected?: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  signData?: SignData;
  translation?: TranslationResult;
  timestamp: Date;
  isFromCurrentUser: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: ChatMessage;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
};

export type OnboardingStackParamList = {
  ConnectGlove: undefined;
  HowItWorks: undefined;
  Benefits: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Groups: undefined;
  Profile: undefined;
};

// UI Component Props
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    error: string;
    success: string;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Language Types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationService {
  translate: (text: string, targetLanguage: string) => Promise<TranslationResult>;
  detectLanguage: (text: string) => Promise<string>;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  owner_id: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  profile_image?: string;
}

// Message Types (API-based)
export interface Message {
  id: string;
  groupId: number;
  senderId: number;
  text: string;
  type: string;
  createdAt: string;
  audio_url?: string | null;
  duration?: number | null;
}

export interface CreateMessagePayload {
  text: string;
  type: string;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface CreateMessageResponse {
  message: Message;
}

// Groups Navigation Types
export type GroupsStackParamList = {
  GroupsList: undefined;
  GroupDetail: {
    groupId: number;
    groupName: string;
    ownerUsername: string;
  };
  EditGroup: {
    groupId: number;
    groupName: string;
    ownerUsername: string;
  };
};
