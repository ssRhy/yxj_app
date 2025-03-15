import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import RecommendedPartners from '../../../components/social/RecommendedPartners';
import PopularActivities from '../../../components/social/PopularActivities';
import { fetchRecommendedPartners, fetchPopularActivities } from '../../../services/socialService';
import { Partner, Activity } from '../../../types/social';

export default function SocialScreen() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 这里将来会调用实际的API
        const partnersData = await fetchRecommendedPartners();
        const activitiesData = await fetchPopularActivities();
        
        setPartners(partnersData);
        setActivities(activitiesData);
        setError(null);
      } catch (err) {
        setError('加载数据失败，请稍后重试');
        console.error('Error loading social data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const navigateToExplore = () => {
    router.push('/social/explore');
  };

  const navigateToMessages = () => {
    router.push('/social/messages');
  };

  const navigateToProfile = () => {
    router.push('/social/profile');
  };

  // 保留函数名但简化功能
  const navigateToTest = () => {
    // 不再导航到测试页面
    console.log('测试功能已移除');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 创建一个渲染函数来处理不同的内容部分
  const renderContent = () => {
    return (
      <>
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>欢迎来到社交广场</Text>
          <Text style={styles.welcomeText}>在这里发现志同道合的伙伴，一起探索更多可能</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>推荐共业伙伴</Text>
            <TouchableOpacity onPress={navigateToExplore}>
              <Text style={styles.seeMoreText}>查看更多</Text>
            </TouchableOpacity>
          </View>
          <RecommendedPartners partners={partners} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门活动</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <PopularActivities activities={activities} />
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>能量共振社区</Text>
        <TouchableOpacity onPress={navigateToMessages} style={styles.messageIcon}>
          <Image 
            source={require('../../../assets/icons/message.png')} 
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.content}
        data={[{ key: 'content' }]}
        renderItem={() => renderContent()}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Image 
            source={require('../../../assets/icons/home.png')} 
            style={[styles.navIcon, styles.activeNavIcon]}
          />
          <Text style={[styles.navText, styles.activeNavText]}>首页</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToExplore}>
          <Image 
            source={require('../../../assets/icons/explore.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>探索</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToMessages}>
          <Image 
            source={require('../../../assets/icons/chat.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>消息</Text>
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
  content: {
    flex: 1,
    paddingBottom: 60, // 为底部导航栏留出空间
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  messageIcon: {
    padding: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  welcomeBanner: {
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#4a6fa5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#4a6fa5',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
