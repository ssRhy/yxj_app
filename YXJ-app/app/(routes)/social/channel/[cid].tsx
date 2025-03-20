import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageList, MessageInput } from "stream-chat-expo";
import { useState, useEffect } from "react";
import { FontAwesome5 } from '@expo/vector-icons';
import { useChatContext } from 'stream-chat-expo';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType|null>(null);
  const {cid} = useLocalSearchParams(); 
  const {client} = useChatContext();
  
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channels = await client.queryChannels({cid:cid as string});
        setChannel(channels[0]);
      } catch (error) {
        console.error("获取频道失败:", error);
      }
    }
    fetchChannel();
  }, [cid, client]);

  if(!channel){
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{channel.data?.name || '聊天'}</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <View style={{ flex: 1 }}>
        <Channel channel={channel}>
          <View style={{ flex: 1 }}>
            <MessageList />
          </View>
          <MessageInput />
        </Channel>
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});