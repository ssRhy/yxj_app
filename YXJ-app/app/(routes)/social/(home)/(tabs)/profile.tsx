import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { useAuth } from '../../providers/AuthProvider';

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

      const { data, error, status } = await supabase
        .from('users')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        console.error('Error fetching user profile:', error)
        throw error
      }

      if (data) {
        setUsername(data.username)
        setFullName(data.full_name)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      
      }
    } catch (error) {
      console.error('Error in getProfile:', error)
      if (error instanceof Error) {
        Alert.alert(error.message)
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
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        username,
        full_name,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      console.log('Attempting to update profile with data:', updates)

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session?.user.id)

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('Profile updated successfully')
      Alert.alert('Success', 'Profile updated successfully')
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
    <View style={styles.container}>
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
          onPress={() => updateProfile({ username, full_name,  website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
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