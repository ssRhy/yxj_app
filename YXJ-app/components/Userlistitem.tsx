import { Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useChatClient } from '../app/(routes)/social/providers/ChatProvider';
import { useAuth } from '../app/(routes)/social/providers/AuthProvider';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

// 定义为普通函数组件，不使用 memo
const UserListItem = ({ user }: { user: any }) => {
    const { client, isConnected, reconnect } = useChatClient();
    const { user: me, profile } = useAuth();
    const [loading, setLoading] = useState(false);
  
    // 使用 useCallback 缓存函数
    const onPress = useCallback(async () => {
      if (!me || !profile) {
        console.error('用户未登录或个人资料不完整');
        Alert.alert('错误', '请先登录');
        return;
      }

      // 防止重复点击
      if (loading) return;
      setLoading(true);

      try {
        // 确保用户已连接
        if (!isConnected) {
          console.log('用户未连接，尝试重新连接...');
          await reconnect();
        }

        // 创建一个唯一的频道ID
        // 对两个用户ID进行排序，确保相同的两个用户总是得到相同的频道ID
        const sortedUserIds = [profile.id, user.id].sort();
        // 使用更短的 ID 格式，确保不超过 64 个字符
        // 只取每个 ID 的前 8 个字符
        const channelId = `${sortedUserIds[0].substring(0, 8)}_${sortedUserIds[1].substring(0, 8)}`;
        
        // 先检查是否已有此频道
        let channel;
        try {
          const channels = await client.queryChannels({ id: channelId });
          if (channels.length > 0) {
            channel = channels[0];
            console.log('找到现有频道:', channel.cid);
          }
        } catch (error) {
          console.log('查询频道失败，将创建新频道:', error);
          // 如果查询失败，可能是连接问题，尝试重新连接
          if (!client.userID) {
            console.log('尝试重新连接用户...');
            await reconnect();
          }
        }
        
        // 如果没有找到现有频道，创建新频道
        if (!channel) {
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
          channel = client.channel('messaging', channelId, {
            members: [profile.id, user.id],
            created_by_id: profile.id,
            name: user.full_name || user.username || user.email,
            image: userImageUrl,
          });
          
          // 创建频道
          await channel.create();
        }
        
        // 监视频道
        await channel.watch();
        
        // 使用完整路径导航到频道页面
        router.push({
          pathname: '/social/channel/[cid]',
          params: { cid: channel.cid }
        });
      } catch (error) {
        console.error('创建聊天失败:', error);
        Alert.alert('错误', '创建聊天失败，请重试');
      } finally {
        setLoading(false);
      }
    }, [client, me, profile, user, loading, isConnected, reconnect]);
  
    return (
      <Pressable
        onPress={onPress}
        style={{ 
          padding: 15, 
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ fontWeight: '600' }}>{user?.full_name || user?.username || "用户"}</Text>
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
      </Pressable>
    );
};
  
export default UserListItem;