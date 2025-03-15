import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchConversations } from '../../../services/socialService';
import { Conversation } from '../../../types/social';

export default function MessagesScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        // 这里将来会调用实际的API
        const data = await fetchConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        setError('加载消息失败，请稍后重试');
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const navigateToChat = (conversationId: string) => {
    router.push(`/social/chat/${conversationId}`);
  };

  const navigateToHome = () => {
    router.push('/social');
  };

  const navigateToExplore = () => {
    router.push('/social/explore');
  };

  const navigateToProfile = () => {
    router.push('/social/profile');
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem} 
      onPress={() => navigateToChat(item.id)}
    >
      <Image source={{ uri: item.partnerAvatar }} style={styles.avatar} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.partnerName}>{item.partnerName}</Text>
          <Text style={styles.timeStamp}>{item.lastMessageTime}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>消息</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载消息中...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('../../../assets/icons/empty-messages.png')} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>暂无消息</Text>
          <Text style={styles.emptySubText}>开始探索并与共业伙伴交流</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={navigateToExplore}
          >
            <Text style={styles.exploreButtonText}>探索伙伴</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
        />
      )}

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
          <Image 
            source={require('../../../assets/icons/home.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>首页</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToExplore}>
          <Image 
            source={require('../../../assets/icons/explore.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>探索</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../../../assets/icons/chat.png')} 
            style={[styles.navIcon, styles.activeNavIcon]}
          />
          <Text style={[styles.navText, styles.activeNavText]}>消息</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
          <Image 
            source={require('../../../assets/icons/user.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>我的</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationsList: {
    paddingVertical: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeStamp: {
    fontSize: 12,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#4a6fa5',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
    opacity: 0.7,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    color: '#4a6fa5',
    fontWeight: 'bold',
  },
});
