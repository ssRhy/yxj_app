 // 占卜数据钩子

import { useState, useEffect } from 'react';
import { ChartData, GrowthEvent } from '../types/chart.types';
import { DivinationResult } from '../types/divination.types';
import { fetchUserChart, updateChartData, getChartGrowthHistory } from '../services/chartService';

// Hook for managing destiny chart data
export const useDestinyChart = (userId: string) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [growthHistory, setGrowthHistory] = useState<GrowthEvent[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  // 加载用户命盘数据
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserChart(userId);
        setChartData(data);
        setGrowthHistory(data.growthHistory);
        setError(null);
      } catch (err) {
        setError('加载命盘数据失败');
        console.error('Failed to load chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [userId]);

  // 处理占卜结果更新命盘
  const updateFromDivination = async (divinationResult: DivinationResult) => {
    if (!chartData) return;

    try {
      setLoading(true);
      const updatedChart = await updateChartData(chartData, divinationResult);
      setChartData(updatedChart);
      setGrowthHistory(updatedChart.growthHistory);
      
      // 触发成长动画
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
      
      return updatedChart;
    } catch (err) {
      setError('更新命盘数据失败');
      console.error('Failed to update chart data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 获取节点详情
  const getNodeDetails = (nodeId: string) => {
    if (!chartData) return null;
    return chartData.nodes.find(node => node.id === nodeId) || null;
  };

  return {
    chartData,
    loading,
    error,
    growthHistory,
    showAnimation,
    updateFromDivination,
    getNodeDetails
  };
};

// Hook for managing divination data
export const useDivination = (userId: string) => {
  const [history, setHistory] = useState<DivinationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载占卜历史
  useEffect(() => {
    const loadDivinationHistory = async () => {
      try {
        setLoading(true);
        // 这里应该是从API获取数据
        // 示例中使用模拟数据
        const mockHistory: DivinationResult[] = [];
        setHistory(mockHistory);
        setError(null);
      } catch (err) {
        setError('加载占卜历史失败');
        console.error('Failed to load divination history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDivinationHistory();
  }, [userId]);

  // 执行新的占卜
  const performDivination = async (
    type: string,
    question: string,
    options?: any
  ): Promise<DivinationResult | null> => {
    try {
      setLoading(true);
      // 这里应该是调用占卜API
      // 示例中使用模拟数据
      const mockResult: DivinationResult = {
        id: `div-${Date.now()}`,
        userId,
        type: type as any,
        timestamp: new Date(),
        question,
        result: {
          symbols: ['示例符号1', '示例符号2'],
          interpretation: '这是一个示例解读',
          insights: ['洞察1', '洞察2'],
          energyValue: 15
        },
        relatedNodeIds: ['node-1', 'node-2'],
        energyContribution: 12
      };

      // 更新历史记录
      setHistory(prev => [mockResult, ...prev]);
      setError(null);
      return mockResult;
    } catch (err) {
      setError('执行占卜失败');
      console.error('Failed to perform divination:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    history,
    loading,
    error,
    performDivination
  };
};
