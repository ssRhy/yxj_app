import { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import UserListItem from '../../../../components/Userlistitem';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      if (!user) {
        console.log('No user found, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id); // exclude me

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        setUsers(profiles || []);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部栏 */}
     
      {/* 用户列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>加载用户列表...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>没有找到其他用户</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => <UserListItem user={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 36, // 与返回按钮宽度相同，保持标题居中
  },
  listContainer: {
    padding: 10,
    gap: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});