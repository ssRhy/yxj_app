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
  height?: number;
  weight?: number;
}

// 上下文接口
interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (userData: Partial<UserInfo>) => Promise<void>;
}

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

// 存储键
const USER_STORAGE_KEY = "user_info";

// 默认用户数据
const defaultUser: UserInfo = {
  id: "default-user-id",
  username: "默认用户",
  email: "user@example.com",
  gender: "male",
  birthDate: "2000-01-01",
  zodiacSign: "水瓶座",
  mbti: "INTJ",
  height: 175,
  weight: 70,
};

// 提供者组件
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(defaultUser); // 默认已设置用户
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <UserContext.Provider value={{ user, isLoading, error, updateUser }}>
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
