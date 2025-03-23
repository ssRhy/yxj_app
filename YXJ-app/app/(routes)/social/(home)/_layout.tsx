import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { Redirect, useRouter } from 'expo-router';
import ChatProvider from '../providers/ChatProvider';

export default function SocialLayout() {
    const { session, profile } = useAuth();
    const router = useRouter();
    
    // 使用 useEffect 监听会话状态变化
    useEffect(() => {
        console.log('SocialLayout: 检查会话状态', session ? '已登录' : '未登录');
        if (!session) {
            console.log('SocialLayout: 未登录，重定向到登录页面');
            // 使用 router.replace 而不是 Redirect 组件
            router.replace('/social/(auth)/login');
        }
    }, [session, router]);
    
    // 如果没有会话，返回 null 防止渲染其他内容
    if (!session) {
        console.log('SocialLayout: 等待重定向...');
        return null;
    }
    
    // 检查用户是否有个人资料
    if (!profile) {
        console.log('SocialLayout: 用户已登录但没有个人资料');
        // 这里可以选择重定向到创建个人资料页面，或者继续显示主页
    }
    
    console.log('SocialLayout: 渲染社交广场');
    return (
        <ChatProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </ChatProvider>
    );
}