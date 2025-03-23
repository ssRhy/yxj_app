import { Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../app/(routes)/social/providers/AuthProvider';
import { router } from 'expo-router';

const UserListItem = ({ user }: { user: any }) => {
    const { client } = useChatContext();
    const { user: me, profile } = useAuth();
  
    const onPress = async () => {
      if (!me || !profile) {
        console.error('用户未登录或个人资料不完整');
        Alert.alert('错误', '请先登录');
        return;
      }

      try {
        console.log('开始创建聊天...');
        
        // 检查用户是否已连接
        if (!client.userID) {
          console.log('用户未连接，尝试连接...');
          
          // 连接用户
          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name || profile.username || profile.email,
              image: profile.avatar_url,
            },
            client.devToken(profile.id)
          );
          
          console.log('用户连接成功');
        }
        
        // 创建频道
        const channel = client.channel('messaging', {
          members: [profile.id, user.id],
        });
        
        await channel.watch();
        console.log('频道创建成功:', channel.cid);
        
        // 导航到频道页面 - 修正导航路径
        router.replace(`/social/channel/${channel.cid}`);
      } catch (error) {
        console.error('创建聊天失败:', error);
        Alert.alert('错误', '创建聊天失败，请重试');
      }
    };
  
    return (
      <Pressable
        onPress={onPress}
        style={{ padding: 15, backgroundColor: 'white' }}
      >
        <Text style={{ fontWeight: '600' }}>{user?.full_name || user?.username || "用户"}</Text>
      </Pressable>
    );
  };
  
  export default UserListItem;