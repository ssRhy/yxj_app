import React from "react";
import { Stack } from "expo-router";
import ChatProvider from "../providers/ChatProvider";

export default function SocialLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ChatProvider>
  );
}
