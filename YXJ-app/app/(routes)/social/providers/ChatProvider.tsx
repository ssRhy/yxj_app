import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../../../../lib/supabase";

// 创建一个新的上下文来管理 Stream Chat 状态
type ChatContextType = {
  client: StreamChat;
  isConnected: boolean;
  reconnect: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | null>(null);

// 导出 hook 以便在组件中使用
export const useChatClient = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatClient must be used within a ChatProvider");
  }
  return context;
};

// 创建 Stream Chat 客户端实例
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
if (!apiKey) {
  console.error("Stream Chat API key is not defined");
}

// 创建全局客户端实例
const client = StreamChat.getInstance(apiKey || "");

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  // 连接用户到 Stream Chat
  const connectUser = async () => {
    if (!profile) {
      console.log("ChatProvider: No profile, cannot connect");
      return;
    }

    try {
      // 如果已经连接了相同的用户，不需要重新连接
      if (client.userID === profile.id) {
        console.log(
          "ChatProvider: User already connected with ID:",
          profile.id
        );
        setIsConnected(true);
        return;
      }

      // 如果连接了不同的用户，先断开连接
      if (client.userID) {
        console.log(
          "ChatProvider: Disconnecting previous user:",
          client.userID
        );
        await client.disconnectUser();
        setIsConnected(false);
      }

      // 预先处理头像 URL，避免在连接时处理
      let imageUrl = null;
      if (profile.avatar_url) {
        try {
          // 检查是否是完整的 URL
          if (profile.avatar_url.startsWith("http")) {
            imageUrl = profile.avatar_url;
          } else {
            // 如果是存储路径，获取公共 URL
            const { data } = supabase.storage
              .from("avatars")
              .getPublicUrl(profile.avatar_url);
            imageUrl = data?.publicUrl || null;
          }
        } catch (error) {
          console.error("ChatProvider: 处理头像 URL 出错:", error);
          imageUrl = null;
        }
      }

      // 连接用户
      console.log("ChatProvider: Connecting user with ID:", profile.id);
      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name || profile.username || profile.email,
          image: imageUrl,
          user_details: {
            email: profile.email,
            username: profile.username || profile.email.split("@")[0],
          },
        },
        client.devToken(profile.id)
      );

      console.log("ChatProvider: User connected successfully");
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("ChatProvider: Error connecting user", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to chat"
      );
      setIsConnected(false);
    }
  };

  // 当 profile 变化时连接用户
  useEffect(() => {
    // 如果没有 profile，仍然渲染子组件，但不连接聊天
    if (!profile) {
      console.log("ChatProvider: No profile, rendering children without chat");
      setIsReady(true);
      return;
    }

    // 减少防抖时间，加快连接速度
    const connectTimeout = setTimeout(() => {
      connectUser();
      setIsReady(true);
    }, 200); // 从 500ms 减少到 200ms

    return () => {
      clearTimeout(connectTimeout);
    };
  }, [profile?.id]);

  // 应用程序退出时断开连接
  useEffect(() => {
    return () => {
      if (client.userID) {
        console.log("ChatProvider: Disconnecting user on unmount");
        client.disconnectUser();
        setIsConnected(false);
      }
    };
  }, []);

  // 提供 ChatContext 和 Stream Chat 组件
  return (
    <ChatContext.Provider
      value={{ client, isConnected, reconnect: connectUser }}
    >
      <OverlayProvider>
        <Chat client={client}>{isReady ? children : null}</Chat>
      </OverlayProvider>
    </ChatContext.Provider>
  );
}
