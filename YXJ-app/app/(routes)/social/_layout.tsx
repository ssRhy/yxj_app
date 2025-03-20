import React from 'react';
import { Stack } from 'expo-router';
import { OverlayProvider } from 'stream-chat-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { client } from './(home)/_layout';
import { Chat } from 'stream-chat-expo';
import ChatProvider from './providers/ChatProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <ChatProvider>
          <Chat client={client}>
            <Stack screenOptions={{ headerShown: false }} />
          </Chat>
        </ChatProvider>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}