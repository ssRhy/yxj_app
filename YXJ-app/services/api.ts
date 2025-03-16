import { supabase, TableData, TableInsert, TableUpdate } from '../lib/supabase';

/**
 * 用户服务 - 处理用户相关的数据操作
 */
export const userService = {
  /**
   * 获取当前用户信息
   * @returns 用户数据或null
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 获取用户详细信息
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return data;
  },

  /**
   * 用户登录
   * @param email 邮箱
   * @param password 密码
   */
  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * 用户注册
   * @param email 邮箱
   * @param password 密码
   * @param userData 用户数据
   */
  async register(email: string, password: string, userData: Omit<TableInsert<'users'>, 'id'>) {
    // 创建认证用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { error: authError };
    }

    // 创建用户资料
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        ...userData
      });

    if (profileError) {
      return { error: profileError };
    }

    return { data: authData };
  },

  /**
   * 用户登出
   */
  async logout() {
    return await supabase.auth.signOut();
  }
};

/**
 * 命运图谱服务 - 处理命运图谱相关的数据操作
 */
export const destinyChartService = {
  /**
   * 获取用户命运图谱
   * @param userId 用户ID
   */
  async getUserChart(userId: string) {
    const { data } = await supabase
      .from('destiny_charts')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return data;
  },

  /**
   * 更新命运图谱
   * @param chartId 图谱ID
   * @param updates 更新数据
   */
  async updateChart(chartId: string, updates: TableUpdate<'destiny_charts'>) {
    return await supabase
      .from('destiny_charts')
      .update(updates)
      .eq('id', chartId);
  },

  /**
   * 创建新的命运图谱
   * @param chartData 图谱数据
   */
  async createChart(chartData: TableInsert<'destiny_charts'>) {
    return await supabase
      .from('destiny_charts')
      .insert(chartData);
  }
};

/**
 * 成长历史服务 - 处理成长历史相关的数据操作
 */
export const growthHistoryService = {
  /**
   * 获取用户成长历史
   * @param userId 用户ID
   * @param limit 限制数量
   */
  async getUserHistory(userId: string, limit = 10) {
    const { data } = await supabase
      .from('growth_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return data;
  },

  /**
   * 添加成长记录
   * @param historyData 历史记录数据
   */
  async addHistoryRecord(historyData: TableInsert<'growth_history'>) {
    return await supabase
      .from('growth_history')
      .insert(historyData);
  }
};

/**
 * 示例：如何使用复杂查询和类型
 * 
 * 获取用户命运图谱和相关的成长历史
 * @param userId 用户ID
 */
export async function getUserChartWithHistory(userId: string) {
  // 定义复杂查询
  const query = supabase
    .from('destiny_charts')
    .select(`
      *,
      growth_history(*)
    `)
    .eq('user_id', userId)
    .single();
  
  // 使用明确定义的ChartWithHistory接口
  type ChartWithHistory = {
    id: string;
    user_id: string;
    created_at: string;
    energy_level: number;
    growth_points: number;
    current_task?: string;
    growth_history: {
      id: string;
      user_id: string;
      created_at: string;
      activity_type: string;
      points_earned: number;
      description: string;
    }[];
  };
  
  const { data, error } = await query;
  
  if (error) {
    console.error('获取命运图谱失败:', error);
    return null;
  }
  
  return data as ChartWithHistory;
}
