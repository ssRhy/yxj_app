export interface Partner {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description?: string;
  resonanceScore: number;
  tags: string[];
}

export interface Activity {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  participants: {
    id: string;
    avatar: string;
  }[];
}

export interface Conversation {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
