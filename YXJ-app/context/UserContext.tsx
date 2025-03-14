import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 用户信息接口
export interface UserInfo {
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  fullName?: string;
  birthDate?: string; // 出生年月，格式：YYYY-MM-DD
  gender?: string;
  zodiacSign?: string; // 星座
  mbti?: string; // MBTI人格类型
  chineseBaZi?: string; // 八字
  createdAt?: string;
  updatedAt?: string;
}

// 上下文接口
interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  login: (userData: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserInfo>) => Promise<void>;
}

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

// 存储键
const USER_STORAGE_KEY = "user_info";

// 提供者组件
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化 - 从存储中加载用户数据
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // 登录 - 保存用户数据
  const login = async (userData: UserInfo) => {
    try {
      setIsLoading(true);
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
      setError(null);
    } catch (err) {
      setError("Failed to save user data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 登出 - 清除用户数据
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setError(null);
    } catch (err) {
      setError("Failed to remove user data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<UserInfo>) => {
    try {
      setIsLoading(true);
      if (!user) {
        setError("No user to update");
        return;
      }

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setError(null);
    } catch (err) {
      setError("Failed to update user data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, login, logout, updateUser }}
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
