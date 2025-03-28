import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { session, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AuthLayout: 检查会话状态", session ? "已登录" : "未登录");
    if (session && profile) {
      console.log("AuthLayout: 已登录，重定向到社交广场首页");
      router.replace("/social/(home)");
    }
  }, [session, profile, router]);

  // 如果用户已登录但正在等待重定向，显示加载指示器
  if (session) {
    console.log("AuthLayout: 已登录，等待重定向...");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 如果用户未登录，显示登录页面
  console.log("AuthLayout: 显示登录页面");
  return <Stack screenOptions={{ headerShown: false }} />;
}
