import { Platform } from 'react-native';

// 硬件设备数据类型
export type HardwareEnergyData = {
  intensity: number;
  timestamp: string;
  rawData?: any;
};

/**
 * 硬件服务 - 处理与外部硬件设备的通信
 * 注意：这是一个模拟版本，用于Expo环境
 * 实际项目中需要使用expo-dev-client或ejected版本来支持蓝牙功能
 */
class HardwareService {
  private isConnected: boolean = false;
  private simulationMode: boolean = true;
  
  constructor() {
    console.log('初始化硬件服务（模拟模式）');
  }

  /**
   * 请求蓝牙权限
   * @returns 是否获得权限
   */
  async requestPermissions(): Promise<boolean> {
    console.log('请求权限（模拟模式）');
    // 在模拟模式下总是返回true
    return true;
  }

  /**
   * 扫描并连接设备
   * @returns 是否成功连接
   */
  async scanAndConnect(): Promise<boolean> {
    try {
      console.log('扫描并连接设备（模拟模式）');
      
      // 模拟连接延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 80%的概率连接成功
      const success = Math.random() > 0.2;
      this.isConnected = success;
      
      if (success) {
        console.log('设备已连接（模拟）');
      } else {
        console.warn('设备连接失败（模拟）');
      }
      
      return success;
    } catch (error) {
      console.error('扫描连接设备失败（模拟）:', error);
      return false;
    }
  }

  /**
   * 读取能量数据
   * @returns 能量数据或null
   */
  async readEnergyData(): Promise<HardwareEnergyData | null> {
    try {
      if (!this.isConnected) {
        console.log('设备未连接，尝试连接...');
        const connected = await this.scanAndConnect();
        if (!connected) {
          console.warn('无法连接设备，使用模拟数据');
          return null;
        }
      }

      // 模拟读取延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟硬件数据
      // 生成70-95之间的随机值，但使其看起来更像硬件数据（更少的小数位）
      const intensity = Math.floor(70 + Math.random() * 25);
      
      // 10%的概率读取失败
      if (Math.random() < 0.1) {
        console.error('读取数据失败（模拟）');
        return null;
      }
      
      console.log('成功读取设备数据（模拟）:', intensity);
      
      return {
        intensity,
        timestamp: new Date().toISOString(),
        rawData: `RAW_DATA_${intensity}`
      };
    } catch (error) {
      console.error('读取能量数据失败（模拟）:', error);
      return null;
    }
  }

  /**
   * 断开设备连接
   */
  disconnect(): void {
    if (this.isConnected) {
      this.isConnected = false;
      console.log('设备已断开连接（模拟）');
    }
  }

  /**
   * 销毁蓝牙管理器
   */
  destroy(): void {
    this.disconnect();
    console.log('硬件服务已销毁（模拟）');
  }
}

// 导出单例
export const hardwareService = new HardwareService();
