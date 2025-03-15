import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import PartnersList from '../../../components/social/PartnersList';
import FilterTags from '../../../components/social/FilterTags';
import { fetchPartnersByFilter } from '../../../services/socialService';
import { Partner } from '../../../types/social';

export default function ExploreScreen() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tags = [
    { id: '1', name: '创业' },
    { id: '2', name: '投资' },
    { id: '3', name: '科技' },
    { id: '4', name: '健康' },
    { id: '5', name: '教育' },
    { id: '6', name: '艺术' },
    { id: '7', name: '环保' },
    { id: '8', name: '社会企业' },
  ];

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        // 这里将来会调用实际的API
        const data = await fetchPartnersByFilter(searchQuery, selectedTags);
        setPartners(data);
        setError(null);
      } catch (err) {
        setError('加载数据失败，请稍后重试');
        console.error('Error loading partners:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, [searchQuery, selectedTags]);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const navigateToHome = () => {
    router.push('/social');
  };

  const navigateToMessages = () => {
    router.push('/social/messages');
  };

  const navigateToProfile = () => {
    router.push('/social/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>探索伙伴</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image 
            source={require('../../../assets/icons/search.png')} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索共业伙伴..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>按兴趣筛选</Text>
        <FilterTags 
          tags={tags} 
          selectedTags={selectedTags} 
          onTagToggle={handleTagToggle} 
        />
      </View>

      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>正在加载伙伴...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryButtonText}>重试</Text>
            </TouchableOpacity>
          </View>
        ) : partners.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>没有找到匹配的伙伴</Text>
            <Text style={styles.emptySubText}>尝试调整筛选条件</Text>
          </View>
        ) : (
          <PartnersList partners={partners} />
        )}
      </ScrollView>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
          <Image 
            source={require('../../../assets/icons/home.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>首页</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../../../assets/icons/explore.png')} 
            style={[styles.navIcon, styles.activeNavIcon]}
          />
          <Text style={[styles.navText, styles.activeNavText]}>探索</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToMessages}>
          <Image 
            source={require('../../../assets/icons/chat.png')} 
            style={styles.navIcon}
          />
          <Text style={styles.navText}>消息</Text>
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    marginBottom: 10,
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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
