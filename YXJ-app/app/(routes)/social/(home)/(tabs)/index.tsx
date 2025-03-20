import React from 'react';
import { View } from 'react-native';
import { ChannelList } from 'stream-chat-expo';
import { router } from 'expo-router';

export default function MainTabScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ChannelList 
        onSelect={(channel) => {
          // 导航到频道页面，传递频道ID
          router.push(`/social/channel/${channel.cid}`);
        }}
      />
    </View>
  );
}
