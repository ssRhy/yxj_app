import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
