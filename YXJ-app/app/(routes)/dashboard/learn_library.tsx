import React from 'react';
import { DestinyChart } from '../../../components/destiny-chart/DestinyChart';
import { DivinationHistory } from '../../../components/divination/DivinationHistory';
import { TaskList } from '../../../components/cultivation/TaskList';
import { ProgressBar, EnergyBadge } from '../../../components/common';
import { useDestinyChart, useDivination } from '../../../hooks';
import { fetchUserChart, updateChartData } from '../../../services/chartService';
import { ChartData, GrowthEvent } from '../../../types/chart.types';
import { DivinationResult } from '../../../types/divination.types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 定义主题颜色
const THEME = {
  deepPurple: '#2D1B54', // 深紫色
  mediumPurple: '#4A2B7E', // 中紫色
  lightPurple: '#6B4AA0', // 浅紫色
  gold: '#D4AF37', // 鎏金色
  lightGold: '#F2D675', // 浅金色
  cream: '#FFF8E1', // 奶油色
  white: '#FFFFFF',
  text: '#F9F5FF', // 浅色文本
  darkText: '#1A0E33', // 深色文本
};

// 自定义进度条组件，支持颜色定制
const CustomProgressBar = ({ value, max }: { value: number, max: number }) => {
  const percentage = (value / max) * 100;
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarTrack}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressBarText}>{percentage.toFixed(0)}%</Text>
    </View>
  );
};

const LearnLibraryPage: React.FC = () => {
  const userId = 'user-1'; // 实际应用中应从用户会话或上下文中获取
  const { chartData, loading, error, growthHistory } = useDestinyChart(userId);
  const { history: divinationHistory } = useDivination(userId);
  
  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>加载数据中...</Text>
      </View>
    );
  }
  
  if (error || !chartData) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>加载数据失败，请重试</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[THEME.deepPurple, THEME.mediumPurple]}
        style={styles.headerGradient}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>学习图书馆</Text>
          <View style={styles.userLevel}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>等级 {chartData.level}</Text>
            </View>
            <EnergyBadge value={chartData.totalEnergy} size="medium" />
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.libraryContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>推荐学习资源</Text>
          <View style={styles.goldLine} />
        </View>
        
        <View style={styles.resourceList}>
          {/* 这里可以根据用户的命盘节点和能量分布推荐学习资源 */}
          <TouchableOpacity style={styles.resourceItem}>
            <LinearGradient
              colors={[THEME.gold, THEME.lightGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resourceIcon}
            >
              <Text style={styles.resourceIconText}>冥</Text>
            </LinearGradient>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>冥想基础</Text>
              <Text style={styles.resourceDescription}>学习基础冥想技巧，提升精神能量</Text>
              <CustomProgressBar value={30} max={100} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <LinearGradient
              colors={[THEME.gold, THEME.lightGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resourceIcon}
            >
              <Text style={styles.resourceIconText}>情</Text>
            </LinearGradient>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>情绪管理</Text>
              <Text style={styles.resourceDescription}>掌握情绪平衡技巧，增强情感节点能量</Text>
              <CustomProgressBar value={45} max={100} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <LinearGradient
              colors={[THEME.gold, THEME.lightGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resourceIcon}
            >
              <Text style={styles.resourceIconText}>身</Text>
            </LinearGradient>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>身体能量</Text>
              <Text style={styles.resourceDescription}>了解身体能量流动，增强身体健康</Text>
              <CustomProgressBar value={20} max={100} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近学习</Text>
          <View style={styles.goldLine} />
        </View>
        
        <View style={styles.recentLearning}>
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentItemContent}>
              <Text style={styles.recentItemTitle}>能量流动基础</Text>
              <Text style={styles.recentItemDescription}>上次学习: 2天前</Text>
            </View>
            <View style={styles.recentItemProgress}>
              <Text style={styles.progressText}>75%</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentItemContent}>
              <Text style={styles.recentItemTitle}>冥想进阶</Text>
              <Text style={styles.recentItemDescription}>上次学习: 5天前</Text>
            </View>
            <View style={styles.recentItemProgress}>
              <Text style={styles.progressText}>40%</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.deepPurple,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.deepPurple,
  },
  loadingText: {
    color: THEME.gold,
    fontSize: 18,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.deepPurple,
    padding: 20,
  },
  errorText: {
    color: THEME.gold,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: THEME.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: THEME.deepPurple,
    fontWeight: 'bold',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.gold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: THEME.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  levelText: {
    color: THEME.deepPurple,
    fontWeight: 'bold',
  },
  libraryContent: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.gold,
    marginBottom: 8,
  },
  goldLine: {
    height: 2,
    backgroundColor: THEME.gold,
    width: 60,
  },
  resourceList: {
    marginBottom: 25,
  },
  resourceItem: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceIconText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.deepPurple,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.white,
    marginBottom: 4,
  },
  resourceDescription: {
    color: THEME.text,
    marginBottom: 12,
    fontSize: 14,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: THEME.lightPurple,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.gold,
    borderRadius: 3,
  },
  progressBarText: {
    marginLeft: 8,
    fontSize: 12,
    color: THEME.gold,
    fontWeight: 'bold',
  },
  recentLearning: {
    marginBottom: 20,
  },
  recentItem: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.white,
    marginBottom: 4,
  },
  recentItemDescription: {
    color: THEME.text,
    fontSize: 12,
  },
  recentItemProgress: {
    backgroundColor: THEME.gold,
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: THEME.deepPurple,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LearnLibraryPage;