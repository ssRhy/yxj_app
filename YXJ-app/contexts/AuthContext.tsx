import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { TableData } from '../lib/supabase';
import { userService } from '../services/api';

// 定义认证上下文的类型
type AuthContextType = {
  session: Session | null;
  user: TableData<'users'> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<TableData<'users'> | null>(null);
  const [loading, setLoading] = useState(true);

  // 监听认证状态变化
  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUser();
      } else {
        setLoading(false);
      }
    });

    // 订阅认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUser();
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 获取用户信息
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 登录方法
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await userService.login(email, password);
      return { error };
    } catch (error) {
      console.error('登录失败:', error);
      return { error };
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await userService.register(email, password, userData);
      return { error };
    } catch (error) {
      console.error('注册失败:', error);
      return { error };
    }
  };

  // 登出方法
  const signOut = async () => {
    try {
      await userService.logout();
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 提供认证上下文
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook，用于在组件中访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};
