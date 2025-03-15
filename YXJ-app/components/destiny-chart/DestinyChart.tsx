import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { ChartNode } from './ChartNode';
import { DestinyLine } from './DestinyLine';
import { EnergyIndicator } from './EnergyIndicator';
import { ChartData, ChartNode as NodeType, GrowthEvent } from '../../types/chart.types';

interface DestinyChartProps {
  data: ChartData;
  level: number;
  energy: number;
  onNodeClick?: (nodeId: string) => void;
  showGrowthAnimation?: boolean;
}

export const DestinyChart: React.FC<DestinyChartProps> = ({ 
  data, 
  level, 
  energy, 
  onNodeClick,
  showGrowthAnimation = false
}) => {
  const chartRef = useRef(null);
  const [animatingNode, setAnimatingNode] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  
  // 处理图谱渲染逻辑
  useEffect(() => {
    if (!data) return;
    
    // 这里可以使用React Native的动画或SVG库来渲染图谱
    // 示例中仅提供React Native渲染方式
  }, [data]);
  
  // 处理成长动画效果
  useEffect(() => {
    if (showGrowthAnimation && data.growthHistory.length > 0) {
      // 获取最新的成长事件
      const latestEvent = data.growthHistory[data.growthHistory.length - 1];
      
      if (latestEvent.nodeId) {
        // 设置动画节点
        setAnimatingNode(latestEvent.nodeId);
        
        // 开始脉动动画
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true
          })
        ]).start(() => {
          // 动画结束后清除
          setAnimatingNode(null);
        });
        
        return () => {
          pulseAnim.setValue(0.5);
        };
      }
    }
  }, [showGrowthAnimation, data.growthHistory, pulseAnim]);
  
  // 节点点击处理
  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
    // 额外的节点点击逻辑
  };
  
  // 根据成长进度显示锁定或解锁的节点
  const renderNodes = () => {
    // 计算中心偏移，使用更合适的偏移量
    const centerOffsetX = 150; // 保持偏移量
    const centerOffsetY = 150; // 保持偏移量
    const scaleFactor = 1.5; // 进一步减小缩放因子，使节点分布更开
    
    return data.nodes.map(node => {
      // 反转坐标系方向，并调整节点位置，使用更合适的缩放比例
      const adjustedX = centerOffsetX - node.position.x / scaleFactor - 25; // 调整坐标缩放
      const adjustedY = centerOffsetY - node.position.y / scaleFactor - 25; // 调整坐标缩放
      
      return (
        <ChartNode 
          key={node.id}
          node={{
            ...node,
            position: {
              x: adjustedX,
              y: adjustedY,
            }
          }}
          isLocked={node.requiredLevel > level}
          energy={node.energy}
          onClick={() => handleNodeClick(node.id)}
        />
      );
    });
  };
  
  // 渲染命运线
  const renderLines = () => {
    // 计算中心偏移，使用更合适的偏移量
    const centerOffsetX = 150; // 保持偏移量
    const centerOffsetY = 150; // 保持偏移量
    const scaleFactor = 0.5; // 进一步减小缩放因子，使节点分布更开
    
    return data.lines.map(line => {
      // 找到源节点和目标节点
      const sourceNode = data.nodes.find(node => node.id === line.sourceId);
      const targetNode = data.nodes.find(node => node.id === line.targetId);
      
      if (!sourceNode || !targetNode) return null;
      
      // 反转坐标系方向，并添加中心偏移，使用更合适的缩放比例
      const x1 = centerOffsetX - sourceNode.position.x / scaleFactor;
      const y1 = centerOffsetY - sourceNode.position.y / scaleFactor;
      const x2 = centerOffsetX - targetNode.position.x / scaleFactor;
      const y2 = centerOffsetY - targetNode.position.y / scaleFactor;
      
      // 计算线条长度和角度
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      return (
        <View 
          key={`${line.sourceId}-${line.targetId}`}
          style={{
            position: 'absolute',
            left: x1,
            top: y1,
            width: length,
            height: 1,
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: `${angle}deg` },
              { translateX: 0 },
              { translateY: 0 }
            ]
          }}
        >
          <DestinyLine 
            line={line}
            isActive={line.requiredLevel <= level}
          />
        </View>
      );
    });
  };
  
  // 渲染成长动画效果
  const renderGrowthAnimation = () => {
    if (!animatingNode) return null;
    
    const node = data.nodes.find(n => n.id === animatingNode);
    if (!node) return null;
    
    // 计算中心偏移，并反转坐标系方向，使用更合适的偏移量和缩放比例
    const centerOffsetX = 100; // 保持偏移量
    const centerOffsetY = 100; // 保持偏移量
    const scaleFactor = 1.0; // 进一步减小缩放因子，使节点分布更开
    
    return (
      <Animated.View 
        style={[styles.growthAnimation, {
          left: centerOffsetX - node.position.x / scaleFactor - 30,
          top: centerOffsetY - node.position.y / scaleFactor - 30,
          width: 60,
          height: 60,
          transform: [{ scale: pulseAnim }],
          opacity: pulseAnim.interpolate({
            inputRange: [0.5, 2],
            outputRange: [1, 0]
          })
        }]}
      />
    );
  };
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.chartLevel}>
          <Text style={styles.levelText}>等级: {level}</Text>
          <Text style={styles.energyText}>能量: {energy}/100</Text>
        </View>
      </View>
      
      <View style={styles.chartVisualization}>
        {/* 图谱背景 */}
        <View style={styles.chartBackground}>
          {/* 可以是曼陀罗、星盘或其他背景图案 */}
        </View>
        {renderLines()}
        {renderNodes()}
        {renderGrowthAnimation()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  chartLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  levelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  energyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  chartVisualization: {
    position: 'relative',
    height: 300,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  chartLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartNodes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  growthAnimation: {
    position: 'absolute',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 30,
  },
  chartLegend: {
    flexDirection: 'row',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColorActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6', // blue-500
    marginRight: 8,
  },
  legendColorLocked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9ca3af', // gray-400
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});
