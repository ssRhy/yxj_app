import React from 'react';
import { ChartNode as NodeType } from '../../types/chart.types';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

interface ChartNodeProps {
  node: NodeType;
  isLocked: boolean;
  energy: number;
  onClick: () => void;
}

export const ChartNode: React.FC<ChartNodeProps> = ({
  node,
  isLocked,
  energy,
  onClick
}) => {
  // 计算能量百分比
  const energyPercentage = Math.min(100, Math.round((energy / node.maxEnergy) * 100));

  // 根据节点类型和能量值确定颜色
  const getNodeColor = () => {
    const baseColors = {
      spiritual: '#8A2BE2', // 紫色
      emotional: '#FF69B4', // 粉色
      physical: '#32CD32', // 绿色
      mental: '#1E90FF', // 蓝色
      social: '#FFA500' // 橙色
    };

    const baseColor = baseColors[node.type] || '#777777';

    if (isLocked) {
      return `${baseColor}44`; // 锁定状态透明度降低
    }

    // 能量越高颜色越深
    const opacity = 0.4 + (energyPercentage / 100) * 0.6;
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  // 节点大小随能量变化
  const getNodeSize = () => {
    const baseSize = 50;
    const energyBonus = (energyPercentage / 100) * 20;
    return baseSize + energyBonus;
  };

  return (
    <TouchableOpacity
      style={[
        styles.chartNode,
        isLocked ? styles.locked : styles.unlocked,
        {
          left: node.position.x,
          top: node.position.y,
          width: getNodeSize(),
          height: getNodeSize(),
          backgroundColor: getNodeColor(),
          borderRadius: getNodeSize() / 2,
          ...(isLocked ? {} : {
            shadowColor: getNodeColor(),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: energyPercentage / 100,
            shadowRadius: energyPercentage / 5,
            elevation: energyPercentage / 10
          })
        }
      ]}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.nodeContent}>
        <Text style={styles.nodeName}>{node.name}</Text>
        {!isLocked && (
          <View style={styles.nodeEnergy}>
            <View style={styles.energyBar}>
              <View
                style={[
                  styles.energyFill,
                  { width: `${energyPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.energyText}>{energy}/{node.maxEnergy}</Text>
          </View>
        )}
        {isLocked && (
          <Text style={styles.lockIcon}>🔒</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chartNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  locked: {
    opacity: 0.7,
  },
  unlocked: {
    opacity: 1,
  },
  nodeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  nodeEnergy: {
    alignItems: 'center',
    marginTop: 4,
  },
  energyBar: {
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  energyFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  energyText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  lockIcon: {
    fontSize: 16,
    color: 'white',
    marginTop: 2,
  },
});
