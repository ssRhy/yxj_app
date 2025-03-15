///<reference types="nativewind/types" />

import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-lg text-gray-800 mb-4">命运图谱应用</Text>
      <Text className="text-gray-600">开始你的修行之旅</Text>
      <StatusBar style="auto" />
    </View>
  );
}
