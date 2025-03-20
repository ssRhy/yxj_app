import { Stack } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) {
    return <Redirect href="/social/(home)" />;
  }
  
  // 如果用户未登录，显示登录页面
  return <Stack screenOptions={{ headerShown: false }} />;
}