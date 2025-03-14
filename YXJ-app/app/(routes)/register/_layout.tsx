import React from "react";
import { Stack } from "expo-router";

export default function RoutesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
