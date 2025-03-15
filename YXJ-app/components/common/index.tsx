import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = '#4a6fa5',
  height = 8,
  showLabel = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const widthAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [percentage, widthAnim]);
  
  return (
    <View className={`progress-container w-full ${className}`}>
      {showLabel && (
        <View className="progress-label flex flex-row justify-between mb-1">
          <Text className="text-sm">
            <Text>{value}</Text>
            <Text className="text-gray-400">/{max}</Text>
          </Text>
          <Text className="progress-percentage text-sm font-bold">{percentage}%</Text>
        </View>
      )}
      
      <View 
        className="progress-track overflow-hidden"
        style={{
          height: height,
          backgroundColor: '#e0e0e0',
          borderRadius: height / 2
        }}
      >
        <Animated.View 
          className="progress-fill h-full"
          style={{
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: color
          }}
        />
      </View>
    </View>
  );
};

interface EnergyBadgeProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  pulsate?: boolean;
  className?: string;
}

export const EnergyBadge: React.FC<EnergyBadgeProps> = ({
  value,
  size = 'medium',
  pulsate = false,
  className = ''
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (pulsate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 750,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true
          })
        ])
      ).start();
    }
    
    return () => {
      pulseAnim.setValue(1);
    };
  }, [pulsate, pulseAnim]);
  
  // 根据大小确定样式
  const getSizeStyles = () => {
    const sizes = {
      small: {
        width: 24,
        height: 24,
        fontSize: 12
      },
      medium: {
        width: 36,
        height: 36,
        fontSize: 14
      },
      large: {
        width: 48,
        height: 48,
        fontSize: 18
      }
    };
    
    return sizes[size];
  };
  
  // 根据能量值确定颜色
  const getColor = () => {
    if (value < 30) return '#ff4d4d'; // 低能量红色
    if (value < 60) return '#ffaa00'; // 中能量黄色
    return '#00cc88'; // 高能量绿色
  };
  
  const sizeStyles = getSizeStyles();
  const color = getColor();
  
  return (
    <Animated.View 
      className={`energy-badge items-center justify-center ${className}`}
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        backgroundColor: color,
        borderRadius: sizeStyles.width / 2,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        transform: [{ scale: pulsate ? pulseAnim : 1 }]
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: sizeStyles.fontSize }}>
        {value}
      </Text>
    </Animated.View>
  );
};
