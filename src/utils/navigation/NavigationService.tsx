import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Compass, Home, User, Users } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { AuthProvider, useAuth } from '../../contexts/auth/AuthContext';
import '../../utils/i18n';

// Screens
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';

// Onboarding screens
import BenefitsScreen from '../../screens/onboarding/BenefitsScreen';
import ConnectGloveScreen from '../../screens/onboarding/ConnectGloveScreen';
import HowItWorksScreen from '../../screens/onboarding/HowItWorksScreen';

// Tab screens
import ExploreScreen from '../../screens/explore/ExploreScreen';
import EditGroupScreen from '../../screens/group/EditGroupScreen';
import GroupDetailScreen from '../../screens/group/GroupDetailScreen';
import GroupsScreen from '../../screens/group/GroupsScreen';
import HomeScreen from '../../screens/home/HomeScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';

// Navigation types
import { AuthStackParamList, GroupsStackParamList, OnboardingStackParamList, RootStackParamList, TabParamList } from '../../types';

// Stack navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const GroupsStack = createStackNavigator<GroupsStackParamList>();
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
          ? ({ current }: any) => ({
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

// Groups Stack Navigator
function GroupsStackNavigator() {
  return (
    <GroupsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios'
          ? ({ current }: any) => ({
            cardStyle: {
              opacity: current.progress,
            },
          })
          : undefined,
      }}
    >
      <GroupsStack.Screen name="GroupsList" component={GroupsScreen} />
      <GroupsStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <GroupsStack.Screen name="EditGroup" component={EditGroupScreen} />
    </GroupsStack.Navigator>
  );
}

// Onboarding Stack
function OnboardingStackNavigator() {
  const { user } = useAuth();
  
  // regular_user ve solo BenefitsScreen, glove_user ve todo el flujo
  const initialRouteName = user?.user_type === 'regular_user' ? 'Benefits' : 'ConnectGlove';
  
  return (
    <OnboardingStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios' 
          ? ({ current }: any) => ({
            cardStyle: {
              opacity: current.progress,
            },
          })
          : undefined,
      }}
    >
      <OnboardingStack.Screen name="ConnectGlove" component={ConnectGloveScreen} />
      <OnboardingStack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <OnboardingStack.Screen name="Benefits" component={BenefitsScreen} />
    </OnboardingStack.Navigator>
  );
}

// Bottom Tab Navigator for main app
function TabNavigatorComponent() {
  const { t } = useTranslation();
  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingBottom: Platform.OS === 'ios' ? 8 : 8,
          paddingTop: 8,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
          borderRadius: 35,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          position: 'absolute',
          backdropFilter: 'blur(20px)',
          ...(Platform.OS === 'ios' && {
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
          }),
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
            <Home size={24} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen
        name="Groups"
        component={GroupsStackNavigator}
        options={({ route }: any) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'GroupsList';
          
          return {
            tabBarLabel: t('groups.tabLabel'),
            tabBarIcon: ({ color }) => (
              <Users size={24} color={color} />
            ),
            tabBarStyle: routeName === 'GroupDetail' || routeName === 'EditGroup' 
              ? { display: 'none' }
              : {
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                borderTopWidth: 0,
                height: Platform.OS === 'ios' ? 80 : 60,
                paddingBottom: Platform.OS === 'ios' ? 8 : 8,
                paddingTop: 8,
                marginHorizontal: 16,
                marginBottom: Platform.OS === 'ios' ? 20 : 10,
                borderRadius: 35,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                position: 'absolute',
                backdropFilter: 'blur(20px)',
                ...(Platform.OS === 'ios' && {
                  backgroundColor: 'rgba(26, 26, 26, 0.95)',
                }),
              },
          };
        }}
      />
      <TabNavigator.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Compass size={24} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: Platform.OS === 'ios' 
          ? ({ current }: any) => ({
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
      ) : !hasCompletedOnboarding ? (
        // Authenticated but hasn't completed onboarding
        <RootStack.Screen name="Onboarding" component={OnboardingStackNavigator} />
      ) : (
        // Authenticated and completed onboarding - show main tabs
        <RootStack.Screen name="MainTabs" component={TabNavigatorComponent} />
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
export { AuthStackParamList, RootStackParamList, TabParamList };

