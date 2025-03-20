import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function SocialRedirect() {
  // 重定向到新的社交广场首页
  return <Redirect href="/social/(tabs)" />;
}
