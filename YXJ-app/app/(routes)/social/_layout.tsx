import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ChatProvider from './providers/ChatProvider';
import AuthProvider from './providers/AuthProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}