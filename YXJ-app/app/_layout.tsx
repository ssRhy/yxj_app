import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { EnergyProvider } from "../contexts/EnergyContext";

export default function Layout() {
  return (
    <UserProvider>
      <EnergyProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </EnergyProvider>
    </UserProvider>
  );
}
