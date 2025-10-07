import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { AuthProvider, useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

// Screens
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import ConnectGloveScreen from '../../screens/onboarding/ConnectGloveScreen';
import HowItWorksScreen from '../../screens/onboarding/HowItWorksScreen';
import BenefitsScreen from '../../screens/onboarding/BenefitsScreen';

// Mock screens for tabs (we'll create these next)
import HomeScreen from '../../screens/home/HomeScreen';
import ChatScreen from '../../screens/chat/ChatScreen';
import ExploreScreen from '../../screens/explore/ExploreScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';

// Navigation types
import { RootStackParamList, AuthStackParamList, TabParamList } from '../../types';

// Stack navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const TabNavigator = createBottomTabNavigator<TabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Auth Stack for login/register
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios' 
          ? ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          })
          : undefined,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Onboarding Stack
function OnboardingStackNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios' 
          ? ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          })
          : undefined,
      }}
    >
      <RootStack.Screen name="ConnectGlove" component={ConnectGloveScreen} />
      <RootStack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <RootStack.Screen name="Benefits" component={BenefitsScreen} />
    </RootStack.Navigator>
  );
}

// Bottom Tab Navigator for main app
function TabNavigatorComponent() {
  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#f99f12',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Light',
          marginTop: 2,
        },
      }}
    >
      <TabNavigator.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <TabNavigator.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>💬</Text>
          ),
        }}
      />
      <TabNavigator.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>🌟</Text>
          ),
        }}
      />
      <TabNavigator.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios' 
          ? ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          })
          : undefined,
      }}
    >
      {!isAuthenticated ? (
        // Not authenticated - show auth screens
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      ) : user ? (
        // Authenticated - check if onboarding completed
        <>
          <RootStack.Screen name="Onboarding" component={ConnectGloveScreen} />
          <RootStack.Screen name="MainTabs" component={TabNavigatorComponent} />
        </>
      ) : (
        // Default
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}

// Export main Navigator with providers
export function NavigationService() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

// Export types
export { RootStackParamList, AuthStackParamList, TabParamList };
