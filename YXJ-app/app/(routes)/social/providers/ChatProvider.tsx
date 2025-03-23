import { Chat, OverlayProvider } from 'stream-chat-expo';
import { PropsWithChildren, useEffect, useState, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import { ActivityIndicator, View, Text } from 'react-native';
import { useAuth } from './AuthProvider';
import { supabase } from '../../../../lib/supabase';

// 使用环境变量中的API密钥
const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;
export const client = StreamChat.getInstance(API_KEY);

export default function ChatProvider({ children }: PropsWithChildren) {

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const connectedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("ChatProvider: profile changed", profile);
    console.log("ChatProvider: Using Stream API Key:", API_KEY);

    // 如果没有profile，仍然渲染子组件，但不连接聊天
    if (!profile) {
      console.log("ChatProvider: No profile, rendering children without chat");
      setIsReady(true); // 设置为ready，这样就会渲染子组件
      return;
    }

    // 如果用户ID与已连接的用户ID相同，则不需要重新连接
    if (connectedUserIdRef.current === profile.id) {
      console.log("ChatProvider: User already connected with ID:", profile.id);
      setIsReady(true);
      return;
    }

    const setupChat = async () => {
      try {
        // 如果已经有连接的用户，先断开连接
        if (client?.userID) {
          console.log("ChatProvider: Disconnecting previous user:", client.userID);
          await client.disconnectUser();
          connectedUserIdRef.current = null;
        }

        console.log("ChatProvider: Setting up chat with profile", {
          id: profile.id,
          name: profile.full_name || profile.username || profile.email,
          image: profile.avatar_url,
        });

        // 连接用户
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name || profile.username || profile.email,
            image: profile.avatar_url,
          },
          client.devToken(profile.id)
        );

        // 记录已连接的用户ID
        connectedUserIdRef.current = profile.id;

        console.log("ChatProvider: Chat setup successful");
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error("ChatProvider: Error setting up chat", err);
        setError(err instanceof Error ? err.message : "Failed to connect to chat");
        setIsReady(true); // 即使出错也设置为ready，这样就会渲染子组件
      }
    };

    setupChat();

    return () => {
      // 组件卸载时不断开连接，让全局client保持连接状态
      // 这样可以避免在路由切换时重复连接/断开
      setIsReady(false);
    }
  }, [profile?.id]);

  // 应用程序退出时断开连接
  useEffect(() => {
    return () => {
      if (client?.userID) {
        console.log("ChatProvider: Disconnecting user on unmount");
        client.disconnectUser();
        connectedUserIdRef.current = null;
      }
    };
  }, []);

  if (error) {
    // 显示错误但仍然渲染子组件
    console.error("ChatProvider Error:", error);
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>正在加载...</Text>
      </View>
    );
  }

  // 始终提供Chat上下文，即使用户未登录或API密钥无效
  return (
    <OverlayProvider>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  );
}