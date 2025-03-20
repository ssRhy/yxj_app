//能量上下文来管理能量数据
//使用React的Context API提供了：

// 全局状态管理，包括当前能量和历史记录
// 加载状态管理
// 刷新数据的方法
// 添加新记录的方法

import React, { createContext, useState, useEffect, useContext } from 'react';
import { energyService, EnergyRecord } from '../services/energyService';

// 能量上下文类型
type EnergyContextType = {
  currentEnergy: EnergyRecord | null;
  historyRecords: EnergyRecord[];
  loading: boolean;
  refreshEnergy: () => Promise<void>;
  addEnergyRecord: (record: Omit<EnergyRecord, 'id'>) => Promise<void>;
};

// 创建上下文
const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

// 能量提供者组件
export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEnergy, setCurrentEnergy] = useState<EnergyRecord | null>(null);
  const [historyRecords, setHistoryRecords] = useState<EnergyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化和加载数据
  useEffect(() => {
    refreshEnergy();
  }, []);

  // 刷新能量数据
  const refreshEnergy = async () => {
    try {
      setLoading(true);
      
      // 获取或生成今日能量记录
      const todayRecord = await energyService.generateTodayEnergyRecord();
      setCurrentEnergy(todayRecord);
      
      // 获取历史记录
      const history = await energyService.getEnergyHistory();
      setHistoryRecords(history);
    } catch (error) {
      console.error('刷新能量数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加能量记录
  const addEnergyRecord = async (record: Omit<EnergyRecord, 'id'>) => {
    try {
      const newRecord = await energyService.addEnergyRecord(record);
      
      // 更新当前能量（如果是今天的记录）
      if (record.date === new Date().toISOString().split('T')[0]) {
        setCurrentEnergy(newRecord);
      }
      
      // 刷新历史记录
      await refreshEnergy();
    } catch (error) {
      console.error('添加能量记录失败:', error);
    }
  };

  return (
    <EnergyContext.Provider
      value={{
        currentEnergy,
        historyRecords,
        loading,
        refreshEnergy,
        addEnergyRecord,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

// 使用能量上下文的钩子
export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy必须在EnergyProvider内部使用');
  }
  return context;
};
