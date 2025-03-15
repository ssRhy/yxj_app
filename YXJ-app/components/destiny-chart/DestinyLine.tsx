import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { ChartLine, LineType } from '../../types/chart.types';

interface DestinyLineProps {
  line: ChartLine;
  isActive: boolean;
}

export const DestinyLine: React.FC<DestinyLineProps> = ({ line, isActive }) => {
  // 根据线条类型和状态确定样式
  const getLineColor = () => {
    const baseColors = {
      [LineType.PRIMARY]: '#ffffff',
      [LineType.SECONDARY]: '#aaaaaa',
      [LineType.POTENTIAL]: '#555555'
    };
    
    const baseColor = baseColors[line.type] || '#777777';
    
    if (!isActive) {
      return `${baseColor}33`; // 未激活状态透明度降低
    }
    
    // 强度越高颜色越亮
    const opacity = 0.3 + (line.strength / 100) * 0.7;
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };
  
  // 线条粗细随强度变化
  const getLineWidth = () => {
    const baseWidth = 1;
    const strengthBonus = (line.strength / 100) * 3;
    return baseWidth + strengthBonus;
  };
  
  // 获取虚线样式
  const getStrokeDashArray = () => {
    return line.type === LineType.POTENTIAL ? [5, 5] : undefined;
  };
  
  return (
    <View 
      style={[
        styles.destinyLine,
        isActive ? styles.active : styles.inactive
      ]}
    >
      <Svg width="100%" height="100%">
        <Line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke={getLineColor()}
          strokeWidth={getLineWidth()}
          strokeDasharray={getStrokeDashArray()}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  destinyLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.5,
  }
});
