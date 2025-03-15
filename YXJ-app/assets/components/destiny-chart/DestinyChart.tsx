// 命运图谱主组件
import React, { useEffect, useRef } from 'react';
import { ChartNode } from '../../../components/destiny-chart/ChartNode';
import { DestinyLine } from '../../../components/destiny-chart/DestinyLine';
import { EnergyIndicator } from '../../../components/destiny-chart/EnergyIndicator';
import { ChartData, ChartNode as NodeType } from '../../../types/chart.types';
import { View, Text, StyleSheet } from 'react-native';

interface DestinyChartProps {
  data: ChartData;  
  level: number;
  energy: number;
  onNodeClick?: (nodeId: string) => void;
}

export const DestinyChart: React.FC<DestinyChartProps> = ({ 
  data, 
  level, 
  energy, 
  onNodeClick 
}) => {
  const chartRef = useRef<View>(null);
  
  // 处理图谱渲染逻辑
  useEffect(() => {
    if (!chartRef.current || !data) return;
    
    // 在React Native中，我们不能直接操作DOM
    // 可以使用React Native的布局系统和Animated API来实现可视化效果
  }, [data]);
  
  // 节点点击处理
  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
    // 额外的节点点击逻辑
  };
  
  // 根据成长进度显示锁定或解锁的节点
  const renderNodes = () => {
    return data.nodes.map(node => (
      <ChartNode 
        key={node.id}
        node={node}
        isLocked={node.requiredLevel > level}
        energy={node.energy}
        onClick={() => handleNodeClick(node.id)}
      />
    ));
  };
  
  // 渲染命运线
  const renderLines = () => {
    return data.lines.map(line => (
      <DestinyLine 
        key={`${line.sourceId}-${line.targetId}`}
        line={line}
        isActive={line.requiredLevel <= level}
      />
    ));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>您的命运图谱</Text>
        <EnergyIndicator value={energy} max={100} />
      </View>
      
      <View style={styles.visualization} ref={chartRef}>
        {/* 图谱背景 */}
        <View style={styles.background}>
          {/* 可以是曼陀罗、星盘或其他背景图案 */}
        </View>
        
        {/* 命运线连接 */}
        <View style={styles.lines}>
          {renderLines()}
        </View>
        
        {/* 图谱节点 */}
        <View style={styles.nodes}>
          {renderNodes()}
        </View>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendColorActive}></View>
          <Text>已激活区域</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorLocked}></View>
          <Text>待解锁区域</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  visualization: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  lines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  nodes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColorActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginRight: 4,
  },
  legendColorLocked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9ca3af',
    marginRight: 4,
  },
});