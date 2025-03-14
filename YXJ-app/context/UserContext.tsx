import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 用户信息接口
export interface UserInfo {
  id?: string;
  username: string;
  email: string;
  // 个人信息字段
  gender?: string;
  birthDate?: string; // 出生年月，格式：YYYY-MM-DD
  zodiacSign?: string; // 星座
  mbti?: string; // MBTI人格类型
  chineseBaZi?: string; // 八字
  height?: number; // 身高（厘米）
  weight?: number; // 体重（千克）
  createdAt?: string;
}

// 上下文接口
interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  login: (userData: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (data: Partial<UserInfo>) => Promise<void>;
}

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

// 存储键
const USER_STORAGE_KEY = "user_info";

// 提供者组件
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化 - 从存储中加载用户数据
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // 登录 - 保存用户数据
  const login = async (userData: UserInfo) => {
    try {
      // 添加创建时间和ID
      const enhancedUserData = {
        ...userData,
        id: userData.id || `user_${Date.now()}`,
        createdAt: userData.createdAt || new Date().toISOString(),
      };

      // 保存到状态
      setUser(enhancedUserData);

      // 保存到存储
      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(enhancedUserData)
      );
    } catch (error) {
      console.error("Failed to save user data:", error);
      throw error;
    }
  };

  // 登出 - 清除用户数据
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Failed to remove user data:", error);
      throw error;
    }
  };

  // 更新用户信息
  const updateUserInfo = async (data: Partial<UserInfo>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, login, logout, updateUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 自定义钩子，便于使用上下文
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
