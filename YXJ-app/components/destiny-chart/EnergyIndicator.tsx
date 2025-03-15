import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface EnergyIndicatorProps {
  value: number;
  max: number;
}

export const EnergyIndicator: React.FC<EnergyIndicatorProps> = ({ value, max }) => {
  // 计算能量百分比
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const widthAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [percentage, widthAnim]);
  
  // 根据能量值确定颜色
  const getColor = () => {
    if (percentage < 30) return '#ff3333'; // 低能量红色
    if (percentage < 60) return '#ffaa33'; // 中能量黄色
    return '#33cc33'; // 高能量绿色
  };
  
  return (
    <View className="energy-indicator">
      <Text className="energy-label">能量值</Text>
      <View 
        className="energy-bar-container w-full h-3 bg-neutral-800 rounded-md overflow-hidden my-1"
      >
        <Animated.View 
          className="energy-bar-fill h-full"
          style={{
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: getColor()
          }}
        />
      </View>
      <Text className="energy-value">
        {value}/{max}
      </Text>
    </View>
  );
};
