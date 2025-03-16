//能量历史记录服务，并将其集成到你的实时能量组件

import AsyncStorage from '@react-native-async-storage/async-storage';
import { hardwareService } from './hardwareService';

// 能量记录类型
export type EnergyRecord = {
  id: string;
  date: string;
  intensity: number;
  status: '正常' | '波动' | '低能量' | '高能量';
  notes?: string;
  source?: 'hardware' | 'simulated';
};

// 存储键
const STORAGE_KEYS = {
  ENERGY_HISTORY: 'energy_history',
};

/**
 * 能量服务 - 处理能量数据的记录和获取
 */
export const energyService = {
  /**
   * 获取能量历史记录
   * @param limit 限制返回的记录数量
   * @returns 能量历史记录数组
   */
  async getEnergyHistory(limit = 30): Promise<EnergyRecord[]> {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.ENERGY_HISTORY);
      const history: EnergyRecord[] = historyData ? JSON.parse(historyData) : [];
      
      // 按日期排序（最新的在前）
      return history
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('获取能量历史记录失败:', error);
      return [];
    }
  },

  /**
   * 生成简单的唯一ID
   * 使用时间戳+随机数替代uuid库
   */
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  /**
   * 添加能量记录
   * @param record 能量记录数据
   * @returns 添加的记录
   */
  async addEnergyRecord(record: Omit<EnergyRecord, 'id'>): Promise<EnergyRecord> {
    try {
      // 获取现有记录
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.ENERGY_HISTORY);
      const history: EnergyRecord[] = historyData ? JSON.parse(historyData) : [];
      
      // 创建新记录
      const newRecord: EnergyRecord = {
        id: this.generateId(),
        ...record,
      };
      
      // 添加到历史记录
      const updatedHistory = [newRecord, ...history];
      await AsyncStorage.setItem(STORAGE_KEYS.ENERGY_HISTORY, JSON.stringify(updatedHistory));
      
      return newRecord;
    } catch (error) {
      console.error('添加能量记录失败:', error);
      throw error;
    }
  },

  /**
   * 获取最新的能量记录
   * @returns 最新的能量记录或null
   */
  async getLatestEnergyRecord(): Promise<EnergyRecord | null> {
    try {
      const history = await this.getEnergyHistory(1);
      return history.length > 0 ? history[0] : null;
    } catch (error) {
      console.error('获取最新能量记录失败:', error);
      return null;
    }
  },

  /**
   * 确定能量状态
   * @param intensity 能量强度
   * @returns 能量状态
   */
  determineEnergyStatus(intensity: number): '正常' | '波动' | '低能量' | '高能量' {
    if (intensity < 70) return '低能量';
    if (intensity > 90) return '高能量';
    if (intensity > 85 && intensity <= 90) return '波动';
    return '正常';
  },

  /**
   * 从硬件获取能量数据
   * @returns 能量强度或null（如果获取失败）
   */
  async getEnergyFromHardware(): Promise<number | null> {
    try {
      const energyData = await hardwareService.readEnergyData();
      if (energyData) {
        console.log('从硬件获取到能量数据:', energyData);
        return energyData.intensity;
      }
      return null;
    } catch (error) {
      console.error('从硬件获取能量数据失败:', error);
      return null;
    }
  },

  /**
   * 生成今日能量记录
   * 优先从硬件获取数据，如果失败则使用模拟数据
   * @returns 今日能量记录
   */
  async generateTodayEnergyRecord(): Promise<EnergyRecord> {
    // 获取今天的日期，格式为YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // 检查今天是否已经有记录
    const history = await this.getEnergyHistory();
    const todayRecord = history.find(record => record.date === today);
    
    if (todayRecord) {
      return todayRecord;
    }
    
    // 尝试从硬件获取能量数据
    let intensity: number;
    let source: 'hardware' | 'simulated' = 'simulated';
    
    const hardwareIntensity = await this.getEnergyFromHardware();
    if (hardwareIntensity !== null) {
      // 使用硬件数据
      intensity = hardwareIntensity;
      source = 'hardware';
      console.log('使用硬件能量数据:', intensity);
    } else {
      // 回退到模拟数据
      intensity = Math.round((70 + Math.random() * 25) * 10) / 10;
      console.log('使用模拟能量数据:', intensity);
    }
    
    const status = this.determineEnergyStatus(intensity);
    
    // 创建并保存新记录
    return await this.addEnergyRecord({
      date: today,
      intensity,
      status,
      source,
    });
  }
};
