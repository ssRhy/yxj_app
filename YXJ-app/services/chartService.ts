// 图谱数据服务

import { ChartData, ChartNode, GrowthEvent, GrowthEventType, NodeType, LineType } from '../types/chart.types';
import { DivinationResult, DivinationType } from '../types/divination.types';

// Mock data for development - would be replaced with actual API calls
const mockChartData: ChartData = {
  id: 'chart-1',
  userId: 'user-1',
  nodes: [
    {
      id: 'node-1',
      name: '精神觉醒',
      description: '开启内在精神力量的源泉',
      type: NodeType.SPIRITUAL,
      position: { x: 100, y: 100 },
      energy: 30,
      maxEnergy: 100,
      requiredLevel: 1,
      unlocked: true,
      divinationIds: []
    },
    {
      id: 'node-2',
      name: '情感平衡',
      description: '达到情感的和谐与平衡',
      type: NodeType.EMOTIONAL,
      position: { x: 200, y: 150 },
      energy: 20,
      maxEnergy: 100,
      requiredLevel: 1,
      unlocked: true,
      divinationIds: []
    },
    {
      id: 'node-3',
      name: '身体健康',
      description: '身体能量的流动与平衡',
      type: NodeType.PHYSICAL,
      position: { x: 300, y: 100 },
      energy: 15,
      maxEnergy: 100,
      requiredLevel: 2,
      unlocked: false,
      divinationIds: []
    },
    {
      id: 'node-4',
      name: '智慧洞察',
      description: '开发内在智慧与洞察力',
      type: NodeType.MENTAL,
      position: { x: 150, y: 250 },
      energy: 10,
      maxEnergy: 100,
      requiredLevel: 2,
      unlocked: false,
      divinationIds: []
    },
    {
      id: 'node-5',
      name: '人际关系',
      description: '社交能量与人际关系的平衡',
      type: NodeType.SOCIAL,
      position: { x: 250, y: 250 },
      energy: 5,
      maxEnergy: 100,
      requiredLevel: 3,
      unlocked: false,
      divinationIds: []
    }
  ],
  lines: [
    {
      id: 'line-1',
      sourceId: 'node-1',
      targetId: 'node-2',
      strength: 70,
      requiredLevel: 1,
      type: LineType.PRIMARY
    },
    {
      id: 'line-2',
      sourceId: 'node-2',
      targetId: 'node-3',
      strength: 50,
      requiredLevel: 2,
      type: LineType.SECONDARY
    },
    {
      id: 'line-3',
      sourceId: 'node-1',
      targetId: 'node-4',
      strength: 60,
      requiredLevel: 2,
      type: LineType.PRIMARY
    },
    {
      id: 'line-4',
      sourceId: 'node-4',
      targetId: 'node-5',
      strength: 40,
      requiredLevel: 3,
      type: LineType.POTENTIAL
    },
    {
      id: 'line-5',
      sourceId: 'node-3',
      targetId: 'node-5',
      strength: 30,
      requiredLevel: 3,
      type: LineType.SECONDARY
    }
  ],
  level: 1,
  totalEnergy: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
  growthHistory: []
};

// Configuration for chart growth
const growthConfig = {
  nodeLevelThresholds: [0, 30, 60, 90],
  chartLevelThresholds: [0, 50, 150, 300, 500],
  energyDecayRate: 0.05,
  divinationEnergyMap: {
    [DivinationType.TAROT]: 10,
    [DivinationType.I_CHING]: 15,
    [DivinationType.ASTROLOGY]: 20,
    [DivinationType.NUMEROLOGY]: 8,
    [DivinationType.RUNES]: 12
  }
};

// Mapping divination symbols to chart nodes
const divinationToNodeMapping: Record<DivinationType, Record<string, string[]>> = {
  [DivinationType.TAROT]: {
    'The Fool': ['node-1'],
    'The Magician': ['node-1', 'node-4'],
    'The High Priestess': ['node-1', 'node-2'],
    'The Empress': ['node-2', 'node-5'],
    'The Emperor': ['node-3', 'node-5'],
    // ... more mappings
  },
  [DivinationType.I_CHING]: {
    // Hexagram mappings
  },
  [DivinationType.ASTROLOGY]: {
    // Astrological mappings
  },
  [DivinationType.NUMEROLOGY]: {
    // Numerology mappings
  },
  [DivinationType.RUNES]: {
    // Rune mappings
  }
};

// Fetch user's chart data
export const fetchUserChart = async (userId: string): Promise<ChartData> => {
  // In a real app, this would be an API call
  console.log(`Fetching chart for user: ${userId}`);
  return mockChartData;
};

// Update chart data after a divination
export const updateChartData = async (
  chartData: ChartData,
  divinationResult: DivinationResult
): Promise<ChartData> => {
  const updatedChart = { ...chartData };
  const energyValue = divinationResult.result.energyValue;
  const affectedNodeIds: string[] = [];
  
  // Map divination symbols to node IDs
  divinationResult.result.symbols.forEach(symbol => {
    const mapping = divinationToNodeMapping[divinationResult.type];
    if (mapping && mapping[symbol]) {
      affectedNodeIds.push(...mapping[symbol]);
    }
  });
  
  // Update affected nodes
  updatedChart.nodes = updatedChart.nodes.map(node => {
    if (affectedNodeIds.includes(node.id)) {
      const nodeEnergyIncrease = Math.round(energyValue / affectedNodeIds.length);
      const newEnergy = Math.min(node.energy + nodeEnergyIncrease, node.maxEnergy);
      
      // Check if node should be unlocked
      const wasLocked = !node.unlocked;
      const shouldUnlock = node.requiredLevel <= updatedChart.level && newEnergy >= growthConfig.nodeLevelThresholds[1];
      
      // Create growth event if node is unlocked
      if (wasLocked && shouldUnlock) {
        updatedChart.growthHistory.push({
          id: `growth-${Date.now()}-${node.id}`,
          timestamp: new Date(),
          type: GrowthEventType.NODE_UNLOCK,
          nodeId: node.id,
          divinationId: divinationResult.id,
          energyChange: nodeEnergyIncrease,
          description: `解锁了节点: ${node.name}`
        });
      }
      
      // Create energy increase event
      updatedChart.growthHistory.push({
        id: `growth-${Date.now()}-energy-${node.id}`,
        timestamp: new Date(),
        type: GrowthEventType.ENERGY_INCREASE,
        nodeId: node.id,
        divinationId: divinationResult.id,
        energyChange: nodeEnergyIncrease,
        description: `节点 ${node.name} 能量增加了 ${nodeEnergyIncrease}`
      });
      
      // Update node data
      return {
        ...node,
        energy: newEnergy,
        unlocked: shouldUnlock || node.unlocked,
        divinationIds: [...node.divinationIds, divinationResult.id]
      };
    }
    return node;
  });
  
  // Update total energy
  const totalEnergyIncrease = Math.round(energyValue * 0.8); // 80% of divination energy goes to total
  const newTotalEnergy = updatedChart.totalEnergy + totalEnergyIncrease;
  updatedChart.totalEnergy = newTotalEnergy;
  
  // Check for chart level up
  const currentLevel = updatedChart.level;
  let newLevel = currentLevel;
  
  for (let i = currentLevel; i < growthConfig.chartLevelThresholds.length; i++) {
    if (newTotalEnergy >= growthConfig.chartLevelThresholds[i]) {
      newLevel = i;
    } else {
      break;
    }
  }
  
  // Create level up event if applicable
  if (newLevel > currentLevel) {
    updatedChart.level = newLevel;
    updatedChart.growthHistory.push({
      id: `growth-${Date.now()}-level`,
      timestamp: new Date(),
      type: GrowthEventType.LEVEL_UP,
      energyChange: totalEnergyIncrease,
      divinationId: divinationResult.id,
      description: `命盘等级提升至 ${newLevel}`
    });
  }
  
  updatedChart.updatedAt = new Date();
  
  return updatedChart;
};

// Get growth history for a chart
export const getChartGrowthHistory = async (chartId: string): Promise<GrowthEvent[]> => {
  // In a real app, this would be an API call
  return mockChartData.growthHistory;
};

// Calculate node unlock progress
export const calculateNodeUnlockProgress = (node: ChartNode): number => {
  const { energy, requiredLevel, maxEnergy } = node;
  const threshold = growthConfig.nodeLevelThresholds[requiredLevel] || 0;
  
  if (energy <= threshold) {
    return Math.round((energy / threshold) * 100);
  }
  
  return 100;
};