import { Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { useChatClient } from '../app/(routes)/social/providers/ChatProvider';
import { useAuth } from '../app/(routes)/social/providers/AuthProvider';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const UserListItem = ({ user }: { user: any }) => {
    const { client, isConnected, reconnect } = useChatClient();
    const { user: me, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // 预先计算频道ID，避免在点击时计算
    const channelId = useMemo(() => {
      if (!profile || !user) return '';
      
      // 对两个用户ID进行排序，确保相同的两个用户总是得到相同的频道ID
      const sortedUserIds = [profile.id, user.id].sort();
      // 使用更短的 ID 格式，确保不超过 64 个字符
      return `${sortedUserIds[0].substring(0, 8)}_${sortedUserIds[1].substring(0, 8)}`;
    }, [profile?.id, user?.id]);
    
    // 预先处理用户头像URL
    const userImageUrl = useMemo(() => {
      if (!user?.avatar_url) return null;
      
      try {
        // 检查是否是完整的 URL
        if (user.avatar_url.startsWith('http')) {
          return user.avatar_url;
        } else {
          // 如果是存储路径，获取公共 URL
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(user.avatar_url);
          return data?.publicUrl || null;
        }
      } catch (error) {
        console.error("处理头像 URL 出错:", error);
        return null;
      }
    }, [user?.avatar_url]);
  
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
        // 确保用户已连接，但不等待重连完成，先开始导航
        if (!isConnected) {
          console.log('用户未连接，尝试重新连接...');
          reconnect().catch(err => console.error('重连失败:', err));
        }

        // 先检查是否已有此频道
        let channel;
        try {
          const channels = await client.queryChannels({ id: channelId });
          if (channels.length > 0) {
            channel = channels[0];
          }
        } catch (error) {
          console.log('查询频道失败，将创建新频道');
          // 如果查询失败，可能是连接问题，尝试重新连接
          if (!client.userID) {
            await reconnect();
          }
        }
        
        // 如果没有找到现有频道，创建新频道
        if (!channel) {
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
        
        // 监视频道 - 使用 Promise.all 并行处理
        const watchPromise = channel.watch();
        
        // 立即开始导航，不等待 watch 完成
        router.push({
          pathname: '/social/channel/[cid]',
          params: { cid: channel.cid }
        });
        
        // 在后台等待 watch 完成
        await watchPromise;
        
      } catch (error) {
        console.error('创建聊天失败:', error);
        Alert.alert('错误', '创建聊天失败，请重试');
      } finally {
        setLoading(false);
      }
    }, [channelId, client, me, profile, user, loading, isConnected, reconnect, userImageUrl]);
  
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