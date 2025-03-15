import React from 'react';
import { DivinationResult, DivinationType } from '../../types/divination.types';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

interface DivinationHistoryProps {
  results: DivinationResult[];
  onSelectDivination?: (divination: DivinationResult) => void;
}

export const DivinationHistory: React.FC<DivinationHistoryProps> = ({ 
  results, 
  onSelectDivination 
}) => {
  // 获取占卜类型的中文名称
  const getDivinationTypeName = (type: DivinationType): string => {
    const typeNames = {
      [DivinationType.TAROT]: '塔罗牌',
      [DivinationType.I_CHING]: '易经',
      [DivinationType.ASTROLOGY]: '星象',
      [DivinationType.NUMEROLOGY]: '数字学',
      [DivinationType.RUNES]: '符文'
    };
    
    return typeNames[type] || '未知类型';
  };
  
  // 格式化日期
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 处理点击事件
  const handlePress = (divination: DivinationResult) => {
    if (onSelectDivination) {
      onSelectDivination(divination);
    }
  };
  
  return (
    <View style={styles.divinationHistory}>
      <Text style={styles.title}>占卜历史记录</Text>
      
      {results.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyText}>暂无占卜记录</Text>
          <Text style={styles.emptySubText}>进行占卜将帮助您解锁命盘节点并获得能量</Text>
        </View>
      ) : (
        <ScrollView style={styles.historyList}>
          {results.map(divination => (
            <TouchableOpacity 
              key={divination.id} 
              style={styles.historyItem}
              onPress={() => handlePress(divination)}
              activeOpacity={0.7}
            >
              <View style={styles.historyHeader}>
                <Text style={styles.divinationType}>{getDivinationTypeName(divination.type)}</Text>
                <Text style={styles.divinationDate}>{formatDate(divination.timestamp)}</Text>
              </View>
              
              <View style={styles.divinationQuestion}>
                <Text>
                  <Text style={styles.boldText}>问题:</Text> {divination.question}
                </Text>
              </View>
              
              <View style={styles.divinationResult}>
                <View style={styles.resultSymbols}>
                  {divination.result.symbols.map((symbol, index) => (
                    <View key={index} style={styles.symbolTag}>
                      <Text style={styles.symbolText}>{symbol}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.resultEnergy}>
                  <Text style={styles.energyLabel}>能量贡献:</Text>
                  <Text style={styles.energyValue}>+{divination.energyContribution}</Text>
                </View>
              </View>
              
              <View style={styles.divinationNodes}>
                <Text style={styles.nodesText}>
                  <Text style={styles.boldText}>影响节点:</Text> {divination.relatedNodeIds.length} 个节点
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  divinationHistory: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: '#6b7280',
  },
  emptySubText: {
    color: '#6b7280',
    marginTop: 8,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divinationType: {
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  divinationDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  divinationQuestion: {
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  divinationResult: {
    marginBottom: 4,
  },
  resultSymbols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  symbolTag: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  symbolText: {
    color: '#1d4ed8',
    fontSize: 12,
  },
  resultEnergy: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  energyLabel: {
    color: '#4b5563',
    marginRight: 8,
  },
  energyValue: {
    color: '#059669',
    fontWeight: 'bold',
  },
  divinationNodes: {
    marginTop: 8,
  },
  nodesText: {
    color: '#4b5563',
    fontSize: 12,
  },
});
