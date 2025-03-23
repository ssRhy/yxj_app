import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';

export default function TabsNavigator() {
  const { session, profile } = useAuth();

  useEffect(() => {
    console.log('TabsNavigator: 加载标签页布局', { 
      hasSession: !!session, 
      hasProfile: !!profile 
    });
  }, [session, profile]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="comment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// import React from 'react';
// import { useEffect } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Stack } from 'expo-router';
// import { StreamChat } from "stream-chat";
// import { OverlayProvider, Chat } from 'stream-chat-expo';
// import { ChannelList } from 'stream-chat-expo';

// // 创建StreamChat实例
// export const client = StreamChat.getInstance("22x5fn8ue5wr");

// export default function SocialLayout() {
//     useEffect(() => {
//       const connect = async () => {
//         try {
//           // 连接用户
//           await client.connectUser(
//             {
//               id: "jlahey",
//               name: "Jim Lahey",
//               image: "https://i.imgur.com/fR9Jz14.png",
//             },
//             client.devToken("jlahey")
//           );
          
//           console.log("Stream Chat用户连接成功");
//         } catch (error) {
//           console.error("Stream Chat用户连接失败:", error);
//         }
//       };
      
//       connect();
      
    
//     }, []);

//     return (
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <OverlayProvider>
//           <Chat client={client}>
//             <Stack screenOptions={{ headerShown: false }} />
//           </Chat>
//         </OverlayProvider>
//       </GestureHandlerRootView>
//     );
// }