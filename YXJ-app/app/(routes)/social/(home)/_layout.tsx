import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { Redirect } from 'expo-router';
import ChatProvider from '../providers/ChatProvider';

export default function SocialLayout() {
    const { user } = useAuth();
    if (!user) {
        return <Redirect href="/social/(auth)/login" />;
    }
    return (
        <ChatProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </ChatProvider>
    )
}