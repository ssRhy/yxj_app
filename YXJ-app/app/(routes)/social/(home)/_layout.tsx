import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { StreamChat } from "stream-chat";
import { Chat } from 'stream-chat-expo';
import { ActivityIndicator, View } from 'react-native';
import ChatProvider from '../providers/ChatProvider';

// 创建StreamChat实例
export const client = StreamChat.getInstance("22x5fn8ue5wr");

export default function SocialLayout() {
   
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const setupChat = async () => {
        try {
          setIsLoading(true);
          // 连接用户
          await client.connectUser(
            {
              id: "jlahey",
              name: "Jim Lahey",
              image: "https://i.imgur.com/fR9Jz14.png",
            },
            client.devToken("jlahey")
          );
          
          console.log("Stream Chat用户连接成功");
          
          // 创建并监视频道
          const newChannel = client.channel("messaging", "work", {
            name: "Awesome channel about work",
          });
          await newChannel.watch();
          
        } catch (error) {
          console.error("Stream Chat用户连接失败:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      setupChat();
      
    }, []);

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      
          <ChatProvider>
            <Chat client={client}>
              <Slot />
            </Chat>
          </ChatProvider>
    );
}