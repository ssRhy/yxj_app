import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { destinyChartService, growthHistoryService } from '../services/api';
import { TableData } from '../lib/supabase';

// 定义命运图谱上下文类型
type DestinyChartContextType = {
  chart: TableData<'destiny_charts'> | null;
  history: TableData<'growth_history'>[] | null;
  loading: boolean;
  error: string | null;
  refreshChart: () => Promise<void>;
  updateEnergyLevel: (amount: number) => Promise<void>;
  addGrowthPoints: (points: number, activityType: string, description: string) => Promise<void>;
  setCurrentTask: (task: string) => Promise<void>;
};

// 创建命运图谱上下文
const DestinyChartContext = createContext<DestinyChartContextType | undefined>(undefined);

// 命运图谱提供者组件
export const DestinyChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chart, setChart] = useState<TableData<'destiny_charts'> | null>(null);
  const [history, setHistory] = useState<TableData<'growth_history'>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 当用户变化时获取命运图谱数据
  useEffect(() => {
    if (user) {
      refreshChart();
    } else {
      setChart(null);
      setHistory(null);
      setLoading(false);
    }
  }, [user]);

  // 刷新命运图谱数据
  const refreshChart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 获取命运图谱
      const chartData = await destinyChartService.getUserChart(user.id);
      setChart(chartData);
      
      // 如果没有命运图谱，创建一个新的
      if (!chartData) {
        const { data, error } = await destinyChartService.createChart({
          user_id: user.id,
          energy_level: 0,
          growth_points: 0
        });
        
        if (error) throw error;
        
        // 获取新创建的图谱
        if (data) {
          const newChart = await destinyChartService.getUserChart(user.id);
          setChart(newChart);
        }
      }
      
      // 获取成长历史
      const historyData = await growthHistoryService.getUserHistory(user.id);
      setHistory(historyData);
      
    } catch (err) {
      console.error('获取命运图谱失败:', err);
      setError('获取命运图谱数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 更新能量等级
  const updateEnergyLevel = async (amount: number) => {
    if (!chart || !user) return;
    
    try {
      const newLevel = chart.energy_level + amount;
      
      // 更新图谱
      const { error } = await destinyChartService.updateChart(chart.id, {
        energy_level: newLevel
      });
      
      if (error) throw error;
      
      // 更新本地状态
      setChart({
        ...chart,
        energy_level: newLevel
      });
      
    } catch (err) {
      console.error('更新能量等级失败:', err);
      setError('更新能量等级失败，请稍后重试');
    }
  };

  // 添加成长点数
  const addGrowthPoints = async (points: number, activityType: string, description: string) => {
    if (!chart || !user) return;
    
    try {
      // 添加成长历史记录
      const { error: historyError } = await growthHistoryService.addHistoryRecord({
        user_id: user.id,
        activity_type: activityType,
        points_earned: points,
        description
      });
      
      if (historyError) throw historyError;
      
      // 更新图谱点数
      const newPoints = chart.growth_points + points;
      const { error: chartError } = await destinyChartService.updateChart(chart.id, {
        growth_points: newPoints
      });
      
      if (chartError) throw chartError;
      
      // 更新本地状态
      setChart({
        ...chart,
        growth_points: newPoints
      });
      
      // 刷新历史记录
      const historyData = await growthHistoryService.getUserHistory(user.id);
      setHistory(historyData);
      
    } catch (err) {
      console.error('添加成长点数失败:', err);
      setError('添加成长点数失败，请稍后重试');
    }
  };

  // 设置当前任务
  const setCurrentTask = async (task: string) => {
    if (!chart) return;
    
    try {
      const { error } = await destinyChartService.updateChart(chart.id, {
        current_task: task
      });
      
      if (error) throw error;
      
      // 更新本地状态
      setChart({
        ...chart,
        current_task: task
      });
      
    } catch (err) {
      console.error('设置当前任务失败:', err);
      setError('设置当前任务失败，请稍后重试');
    }
  };

  return (
    <DestinyChartContext.Provider
      value={{
        chart,
        history,
        loading,
        error,
        refreshChart,
        updateEnergyLevel,
        addGrowthPoints,
        setCurrentTask
      }}
    >
      {children}
    </DestinyChartContext.Provider>
  );
};

// 自定义Hook，用于在组件中访问命运图谱上下文
export const useDestinyChart = () => {
  const context = useContext(DestinyChartContext);
  if (context === undefined) {
    throw new Error('useDestinyChart必须在DestinyChartProvider内部使用');
  }
  return context;
};
