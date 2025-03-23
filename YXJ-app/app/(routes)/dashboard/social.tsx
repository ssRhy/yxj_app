import React from 'react';
import { Redirect } from 'expo-router';

export default function SocialRedirect() {
  console.log('SocialRedirect: 直接重定向到登录页面');
  // 直接重定向到登录页面，而不是检查会话状态
  return <Redirect href="/social/(auth)/login" />;
}
