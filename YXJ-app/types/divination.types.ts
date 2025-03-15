// 占卜相关类型定义

export enum DivinationType {
  TAROT = 'tarot',
  I_CHING = 'i_ching',
  ASTROLOGY = 'astrology',
  NUMEROLOGY = 'numerology',
  RUNES = 'runes'
}

export interface DivinationResult {
  id: string;
  userId: string;
  type: DivinationType;
  timestamp: Date;
  question: string;
  result: {
    symbols: string[];
    interpretation: string;
    insights: string[];
    energyValue: number;
  };
  relatedNodeIds: string[]; // IDs of chart nodes affected by this divination
  energyContribution: number; // How much energy this divination contributed to the chart
}

export interface DivinationHistory {
  userId: string;
  results: DivinationResult[];
  totalCount: number;
  frequencyByType: Record<DivinationType, number>;
  lastDivinationDate: Date;
}

export interface DivinationMapping {
  divinationType: DivinationType;
  symbolToNodeMap: Record<string, string[]>; // Maps divination symbols to node IDs
  energyValueMap: Record<string, number>; // Maps divination symbols to energy values
}