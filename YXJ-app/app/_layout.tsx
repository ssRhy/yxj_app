import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { EnergyProvider } from "../contexts/EnergyContext";
import { AuthProvider } from "../contexts/AuthContext";

export default function AppLayout() {
  return (
    <UserProvider>
      <EnergyProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </EnergyProvider>
    </UserProvider>
  );
}
