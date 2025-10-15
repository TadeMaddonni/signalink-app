import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';

import { NavigationService } from './src/utils/navigation/NavigationService';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#000000" />
      <NavigationService />
    </GestureHandlerRootView>
  );
}
