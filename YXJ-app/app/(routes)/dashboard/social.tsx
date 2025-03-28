import React from "react";
import { Redirect } from "expo-router";

export default function SocialRedirect() {
  console.log("SocialRedirect: 直接重定向到登录页面");
  // 保持重定向到登录页面，因为社交功能需要登录
  return <Redirect href="/social/(auth)/login" />;
}
