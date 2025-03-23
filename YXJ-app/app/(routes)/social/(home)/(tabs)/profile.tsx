import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { useAuth } from '../../providers/AuthProvider';
import Avatar from '../../../../../components/avatar';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [full_name, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      console.log('Fetching profile for user ID:', session?.user.id)

      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        console.error('Error fetching user profile:', error)
        throw error
      }

      if (data) {
        console.log('User profile data:', data)
        setUsername(data.username || '')
        setFullName(data.full_name || '')
        setWebsite(data.website || '')
        setAvatarUrl(data.avatar_url || '')
      } else {
        console.log('No user profile found, may need to create one')
        // 如果没有找到用户资料，可以设置默认值
        setUsername('')
        setFullName('')
        setWebsite('')
        setAvatarUrl('')
      }
    } catch (error) {
      console.error('Error in getProfile:', error)
      if (error instanceof Error) {
        Alert.alert('Error fetching profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    full_name,
    website,
    avatar_url,
  }: {
    username: string
    full_name: string
    website: string
    avatar_url: string | null
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      console.log('Current session:', JSON.stringify(session, null, 2))
      console.log('Updating profile with avatar_url:', avatar_url)

      // 确保 avatar_url 是有效的
      let validAvatarUrl = avatar_url
      if (!avatar_url || avatar_url.trim() === '') {
        console.log('Empty avatar_url, using null')
        validAvatarUrl = null
      }

      const updates = {
        id: session?.user.id, 
        email: session?.user.email,
        username,
        full_name,
        website,
        avatar_url: validAvatarUrl,
        updated_at: new Date().toISOString(),
      }

      console.log('Attempting to update profile with data:', updates)
      console.log('Session user ID:', session?.user.id)

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('Upsert successful:', data)
      console.log('Profile updated successfully')
      Alert.alert('Success', 'Profile updated successfully')
      
      // 刷新用户资料
      getProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error instanceof Error) {
        Alert.alert('Error updating profile', error.message)
      } else {
        Alert.alert('Error updating profile', 'An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          size={150}
          url={avatarUrl}
          onUpload={(path: string) => {
            console.log('Avatar uploaded, path:', path)
            setAvatarUrl(path)
            updateProfile({ 
              username, 
              full_name, 
              website, 
              avatar_url: path
            })
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Full Name" value={full_name || ''} onChangeText={(text) => setFullName(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ 
            username, 
            full_name, 
            website, 
            avatar_url: avatarUrl ? avatarUrl : null 
          })}
          disabled={loading}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign Out" onPress={async () => {
          try {
            // 先导航到登录页面，然后再断开连接和登出
            // 这样可以避免在断开连接后尝试使用频道
            router.replace('/social/(auth)/login');
            
            // 短暂延迟，确保导航完成
            setTimeout(async () => {
              // 登出 Supabase
              await supabase.auth.signOut();
              console.log('已成功登出');
            }, 500);
          } catch (error) {
            console.error('登出时出错:', error);
            Alert.alert('登出失败', '请重试');
          }
        }} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})