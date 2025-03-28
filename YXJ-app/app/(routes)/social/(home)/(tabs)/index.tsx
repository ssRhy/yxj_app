import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ChannelList } from "stream-chat-expo";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SocialScreen() {
  const { profile } = useAuth();

  const navigateToUsers = () => {
    router.push("/social/(home)/users");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.usersButton} onPress={navigateToUsers}>
          <FontAwesome5 name="users" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 聊天列表 */}
      <View style={styles.channelListContainer}>
        <ChannelList
          filters={{ members: { $in: [profile?.id || ""] } }}
          onSelect={(channel) => {
            // 导航到频道页面，传递频道ID
            router.push(`/social/channel/${channel.cid}`);
          }}
          EmptyStateIndicator={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>还没有聊天记录</Text>
              <Text style={styles.emptyStateSubText}>
                点击右上角的用户图标开始聊天
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  usersButton: {
    padding: 8,
  },
  channelListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
