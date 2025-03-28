import { Text, Pressable, Alert, ActivityIndicator } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { useChatClient } from "../app/(routes)/social/providers/ChatProvider";
import { useAuth } from "../app/(routes)/social/providers/AuthProvider";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

const UserListItem = ({ user }: { user: any }) => {
  const { client, isConnected, reconnect } = useChatClient();
  const { user: me, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  // 预先计算频道ID，避免在点击时计算
  const channelId = useMemo(() => {
    if (!profile || !user) return "";

    // 对两个用户ID进行排序，确保相同的两个用户总是得到相同的频道ID
    const sortedUserIds = [profile.id, user.id].sort();
    // 使用更短的 ID 格式，确保不超过 64 个字符
    return `${sortedUserIds[0].substring(0, 8)}_${sortedUserIds[1].substring(
      0,
      8
    )}`;
  }, [profile?.id, user?.id]);

  // 预先处理用户头像URL
  const userImageUrl = useMemo(() => {
    if (!user?.avatar_url) return null;

    try {
      // 检查是否是完整的 URL
      if (user.avatar_url.startsWith("http")) {
        return user.avatar_url;
      } else {
        // 如果是存储路径，获取公共 URL
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(user.avatar_url);
        return data?.publicUrl || null;
      }
    } catch (error) {
      console.error("处理头像 URL 出错:", error);
      return null;
    }
  }, [user?.avatar_url]);

  const onPress = useCallback(async () => {
    try {
      setLoading(true);

      // 创建频道
      const channel = client.channel("messaging", channelId, {
        members: [profile.id, user.id],
        created_by_id: profile.id,
        name: user.full_name || user.username || user.email,
        image: user.avatar_url,
      });

      // 创建频道
      await channel.create();
      console.log("频道创建成功:", channel.cid);

      // 导航到频道页面
      router.push({
        pathname: "/social/channel/[cid]",
        params: { cid: channel.cid },
      });
    } catch (error) {
      console.error("创建聊天失败:", error);
      Alert.alert("错误", "创建聊天失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [channelId, client, profile, user, loading]);

  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 15,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: "600" }}>
        {user?.full_name || user?.username || "用户"}
      </Text>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
    </Pressable>
  );
};

export default UserListItem;
