 // 图谱相关类型定义

export interface ChartNode {
  id: string;
  name: string;
  description: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  energy: number;
  maxEnergy: number;
  requiredLevel: number;
  unlocked: boolean;
  divinationIds: string[]; // IDs of divinations that contributed to this node
}

export enum NodeType {
  SPIRITUAL = 'spiritual',
  EMOTIONAL = 'emotional',
  PHYSICAL = 'physical',
  MENTAL = 'mental',
  SOCIAL = 'social'
}

export interface ChartLine {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number; // 0-100, represents the connection strength
  requiredLevel: number;
  type: LineType;
}

export enum LineType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  POTENTIAL = 'potential'
}

export interface ChartData {
  id: string;
  userId: string;
  nodes: ChartNode[];
  lines: ChartLine[];
  level: number;
  totalEnergy: number;
  createdAt: Date;
  updatedAt: Date;
  growthHistory: GrowthEvent[];
}

export interface GrowthEvent {
  id: string;
  timestamp: Date;
  type: GrowthEventType;
  nodeId?: string;
  divinationId?: string;
  energyChange: number;
  description: string;
}

export enum GrowthEventType {
  NODE_UNLOCK = 'node_unlock',
  ENERGY_INCREASE = 'energy_increase',
  LEVEL_UP = 'level_up',
  INSIGHT_GAINED = 'insight_gained'
}

export interface ChartGrowthConfig {
  nodeLevelThresholds: number[]; // Energy thresholds for node levels
  chartLevelThresholds: number[]; // Total energy thresholds for chart levels
  energyDecayRate: number; // Rate at which energy decays over time
  divinationEnergyMap: Record<string, number>; // Maps divination types to energy values
}