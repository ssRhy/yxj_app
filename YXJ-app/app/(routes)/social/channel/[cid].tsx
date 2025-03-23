import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageList, MessageInput, Chat } from "stream-chat-expo";
import { useState, useEffect } from "react";
import { FontAwesome5 } from '@expo/vector-icons';
import { useChatContext } from 'stream-chat-expo';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {cid} = useLocalSearchParams(); 
  const {client} = useChatContext();
  
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        console.log('开始获取频道，CID:', cid);
        
        if (!cid) {
          setError('缺少频道ID');
          setLoading(false);
          return;
        }
        
        // 确保cid是字符串
        const channelId = typeof cid === 'string' ? cid : String(cid);
        console.log('查询频道参数:', {cid: channelId});
        
        const channels = await client.queryChannels({cid: channelId});
        console.log('获取到频道数量:', channels.length);
        
        if (channels.length === 0) {
          setError('未找到频道');
          setLoading(false);
          return;
        }
        
        console.log('获取到频道:', channels[0].cid, '名称:', channels[0].data?.name);
        setChannel(channels[0]);
      } catch (error) {
        console.error("获取频道失败:", error);
        setError('获取频道失败: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setLoading(false);
      }
    }
    
    fetchChannel();
  }, [cid, client]);

  // 返回到聊天列表页面
  const navigateBack = () => {
    router.push('/social/(home)/(tabs)');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>错误: {error}</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={navigateBack}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!channel) {
    return (
      <View style={styles.loadingContainer}>
        <Text>未找到频道</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={navigateBack}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={navigateBack}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {channel.data?.name || '聊天'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* 聊天内容区域 */}
      <View style={styles.chatContainer}>
        <Channel channel={channel}>
          <View style={styles.messageContainer}>
            <MessageList />
          </View>
          <MessageInput />
        </Channel>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    zIndex: 10, // 确保导航栏在最上层
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'blue',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 30, // 保持导航栏平衡
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
  }
});