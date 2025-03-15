import { Partner, Activity, Conversation } from '../types/social';

// 模拟数据 - 在实际应用中，这些数据将从API获取
const mockPartners: Partner[] = [
  {
    id: '1',
    name: '张明',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: '创业者 / 科技创新',
    description: '专注于人工智能领域的创业者，寻找志同道合的合作伙伴共同开发创新产品。',
    resonanceScore: 92,
    tags: ['人工智能', '创业', '科技']
  },
  {
    id: '2',
    name: '李婷',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: '投资顾问 / 金融分析师',
    description: '拥有10年金融市场经验，专注于可持续发展和社会责任投资领域。',
    resonanceScore: 85,
    tags: ['投资', '金融', '可持续发展']
  },
  {
    id: '3',
    name: '王浩',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    title: '产品经理 / 设计思考',
    description: '热衷于用户体验设计和产品创新，擅长将复杂问题简化并找到创新解决方案。',
    resonanceScore: 78,
    tags: ['产品设计', '用户体验', '创新']
  },
  {
    id: '4',
    name: '陈静',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    title: '环保项目负责人',
    description: '致力于环保事业，正在寻找合作伙伴共同推动可持续发展项目。',
    resonanceScore: 81,
    tags: ['环保', '可持续发展', '社会企业']
  },
  {
    id: '5',
    name: '赵伟',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    title: '教育创新者 / 培训师',
    description: '专注于教育科技领域，开发创新教育方法和工具，提升学习效果。',
    resonanceScore: 76,
    tags: ['教育', '科技', '创新']
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    title: '创业者共振沙龙：如何找到理想的合伙人',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2025-03-25',
    location: '上海市',
    participants: [
      { id: '1', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '3', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
      { id: '4', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
      { id: '5', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
    ]
  },
  {
    id: '2',
    title: '可持续发展与社会创新论坛',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2025-04-10',
    location: '北京市',
    participants: [
      { id: '4', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
      { id: '5', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
      { id: '6', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' }
    ]
  },
  {
    id: '3',
    title: '决策风格与领导力工作坊',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2025-04-18',
    location: '广州市',
    participants: [
      { id: '1', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
      { id: '7', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
      { id: '8', avatar: 'https://randomuser.me/api/portraits/women/35.jpg' }
    ]
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    partnerName: '张明',
    partnerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: '我们可以讨论一下人工智能在教育领域的应用，我有一些想法想和你分享。',
    lastMessageTime: '10:30',
    unreadCount: 2
  },
  {
    id: '2',
    partnerName: '李婷',
    partnerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: '关于可持续投资项目的提案，我已经整理好了相关资料，什么时候方便讨论？',
    lastMessageTime: '昨天',
    unreadCount: 0
  },
  {
    id: '3',
    partnerName: '王浩',
    partnerAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    lastMessage: '产品设计方案我已经修改完成，请查收并给我反馈。',
    lastMessageTime: '昨天',
    unreadCount: 1
  }
];

// 模拟API调用函数
export const fetchRecommendedPartners = async (): Promise<Partner[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockPartners.slice(0, 3);
};

export const fetchPopularActivities = async (): Promise<Activity[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockActivities;
};

export const fetchPartnersByFilter = async (searchQuery: string, tagIds: string[]): Promise<Partner[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // 如果没有搜索条件，返回所有伙伴
  if (!searchQuery && tagIds.length === 0) {
    return mockPartners;
  }
  
  // 模拟搜索和筛选逻辑
  return mockPartners.filter(partner => {
    // 搜索名称或标题
    const matchesSearch = !searchQuery || 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 标签筛选
    const matchesTags = tagIds.length === 0 || 
      partner.tags.some(tag => {
        // 这里简化了标签匹配逻辑，实际应用中可能需要更复杂的匹配
        const tagLower = tag.toLowerCase();
        return tagIds.some(id => {
          // 这里假设tagId与标签名称相关
          const tagName = ['创业', '投资', '科技', '健康', '教育', '艺术', '环保', '社会企业'][parseInt(id) - 1];
          return tagName && tagLower.includes(tagName.toLowerCase());
        });
      });
    
    return matchesSearch && matchesTags;
  });
};

export const fetchConversations = async (): Promise<Conversation[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockConversations;
};

// 保留函数名但简化功能
export const submitDecisionTest = async (answers: Record<string, string>) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回简化的响应
  return {
    success: true,
    message: '功能已移除'
  };
};

// 实际项目中，这里会有更多API调用函数
// 例如：获取聊天历史、发送消息、获取用户资料等
