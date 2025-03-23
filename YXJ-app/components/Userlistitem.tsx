import { Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../app/(routes)/social/providers/AuthProvider';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

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
          
          // 处理头像 URL
          let imageUrl = null;
          if (profile.avatar_url) {
            try {
              // 检查是否是完整的 URL
              if (profile.avatar_url.startsWith('http')) {
                imageUrl = profile.avatar_url;
              } else {
                // 如果是存储路径，获取公共 URL
                const { data } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(profile.avatar_url);
                imageUrl = data?.publicUrl || null;
              }
            } catch (error) {
              console.error("处理头像 URL 出错:", error);
              imageUrl = null;
            }
          }
          
          // 连接用户
          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name || profile.username || profile.email,
              image: imageUrl,
              user_details: {
                email: profile.email,
                username: profile.username || profile.email.split('@')[0],
              },
            },
            client.devToken(profile.id)
          );
          
          console.log('用户连接成功');
        } else if (client.userID !== profile.id) {
          console.log('连接的用户ID不匹配，断开当前连接并重新连接...');
          
          // 处理头像 URL
          let imageUrl = null;
          if (profile.avatar_url) {
            try {
              // 检查是否是完整的 URL
              if (profile.avatar_url.startsWith('http')) {
                imageUrl = profile.avatar_url;
              } else {
                // 如果是存储路径，获取公共 URL
                const { data } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(profile.avatar_url);
                imageUrl = data?.publicUrl || null;
              }
            } catch (error) {
              console.error("处理头像 URL 出错:", error);
              imageUrl = null;
            }
          }
          
          // 断开当前连接
          await client.disconnectUser();
          
          // 重新连接
          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name || profile.username || profile.email,
              image: imageUrl,
              user_details: {
                email: profile.email,
                username: profile.username || profile.email.split('@')[0],
              },
            },
            client.devToken(profile.id)
          );
          
          console.log('用户重新连接成功');
        }
        
        // 确认用户已连接
        console.log('当前连接的用户ID:', client.userID);
        
        // 创建一个唯一的频道ID
        // 对两个用户ID进行排序，确保相同的两个用户总是得到相同的频道ID
        const sortedUserIds = [profile.id, user.id].sort();
        // 使用更短的 ID 格式，确保不超过 64 个字符
        // 只取每个 ID 的前 8 个字符
        const channelId = `${sortedUserIds[0].substring(0, 8)}_${sortedUserIds[1].substring(0, 8)}`;
        console.log('创建频道ID:', channelId);
        
        // 处理头像 URL
        let userImageUrl = null;
        if (user.avatar_url) {
          try {
            // 检查是否是完整的 URL
            if (user.avatar_url.startsWith('http')) {
              userImageUrl = user.avatar_url;
            } else {
              // 如果是存储路径，获取公共 URL
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(user.avatar_url);
              userImageUrl = data?.publicUrl || null;
            }
          } catch (error) {
            console.error("处理头像 URL 出错:", error);
            userImageUrl = null;
          }
        }
        
        // 创建频道
        const channel = client.channel('messaging', channelId, {
          members: [profile.id, user.id],
          created_by_id: profile.id,
          name: user.full_name || user.username || user.email,
          image: userImageUrl,
        });
        
        // 创建频道
        await channel.create();
        console.log('频道创建成功:', channel.cid);
        
        // 监视频道
        await channel.watch();
        console.log('频道监视成功');
        
        // 使用完整路径导航到频道页面
        // 确保无论从哪个页面点击用户，都能直接进入聊天
        try {
          // 尝试使用绝对路径导航
          router.push({
            pathname: '/social/channel/[cid]',
            params: { cid: channel.cid }
          });
        } catch (routeError) {
          console.error('导航失败，尝试备用方法:', routeError);
          
          // 备用导航方法
          router.push(`/social/channel/${channel.cid}`);
        }
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