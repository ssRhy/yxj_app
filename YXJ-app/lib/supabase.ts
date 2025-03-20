import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '../database.types'

// 初始化Supabase客户端
const supabaseUrl = "https://linrhaxmzakxedfowuke.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbnJoYXhtemFreGVkZm93dWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTAxMTgsImV4cCI6MjA1NzY2NjExOH0.QpnSI8T5TvMi9EGMU2jrrsGtDVYRVuBpJFIuyDaK67I"

// 创建强类型的Supabase客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

// 导出类型定义，方便其他文件使用
export type { Database, Tables, Enums } from '../database.types'
export type { QueryData, QueryError } from '@supabase/supabase-js'

/**
 * 辅助函数：获取特定表的查询结果类型
 * 用法示例: 
 * const { data } = await supabase.from('users').select()
 * const users: TableData<'users'> = data
 */
export type TableData<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

/**
 * 辅助函数：获取特定表的插入类型
 * 用法示例:
 * const newUser: TableInsert<'users'> = { email: 'test@example.com', ... }
 * await supabase.from('users').insert(newUser)
 */
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

/**
 * 辅助函数：获取特定表的更新类型
 * 用法示例:
 * const userUpdate: TableUpdate<'users'> = { username: 'newname' }
 * await supabase.from('users').update(userUpdate).eq('id', userId)
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']
