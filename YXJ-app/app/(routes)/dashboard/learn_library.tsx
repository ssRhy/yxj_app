import React from 'react';
import { DestinyChart } from '../../../components/destiny-chart/DestinyChart';
import { DivinationHistory } from '../../../components/divination/DivinationHistory';
import { TaskList } from '../../../components/cultivation/TaskList';
import { ProgressBar, EnergyBadge } from '../../../components/common';
import { useDestinyChart, useDivination } from '../../../hooks';
import { fetchUserChart, updateChartData } from '../../../services/chartService';
import { ChartData, GrowthEvent } from '../../../types/chart.types';
import { DivinationResult } from '../../../types/divination.types';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LearnLibraryPage: React.FC = () => {
  const userId = 'user-1'; // 实际应用中应从用户会话或上下文中获取
  const { chartData, loading, error, growthHistory } = useDestinyChart(userId);
  const { history: divinationHistory } = useDivination(userId);
  
  if (loading) {
    return <View style={styles.loading}><Text>加载数据中...</Text></View>;
  }
  
  if (error || !chartData) {
    return <View style={styles.error}><Text>加载数据失败，请重试</Text></View>;
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>学习图书馆</Text>
        <View style={styles.userLevel}>
          <Text style={styles.levelText}>等级 {chartData.level}</Text>
          <EnergyBadge value={chartData.totalEnergy} size="medium" />
        </View>
      </View>
      
    
       
        
        <View style={styles.learningResources}>
          <Text style={styles.sectionTitle}>推荐学习资源</Text>
          <View style={styles.resourceList}>
            {/* 这里可以根据用户的命盘节点和能量分布推荐学习资源 */}
            <View style={styles.resourceItem}>
              <Text style={styles.resourceTitle}>冥想基础</Text>
              <Text style={styles.resourceDescription}>学习基础冥想技巧，提升精神能量</Text>
              <ProgressBar value={30} max={100} />
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceTitle}>情绪管理</Text>
              <Text style={styles.resourceDescription}>掌握情绪平衡技巧，增强情感节点能量</Text>
              <ProgressBar value={45} max={100} />
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceTitle}>身体能量</Text>
              <Text style={styles.resourceDescription}>了解身体能量流动，增强身体健康</Text>
              <ProgressBar value={20} max={100} />
            </View>
          </View>
        </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    marginRight: 8,
  },
  libraryContent: {
    padding: 16,
  },
  chartPreview: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  divinationSection: {
    marginBottom: 20,
  },
  learningResources: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resourceList: {
  },
  resourceItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resourceDescription: {
    color: '#666',
    marginBottom: 12,
  },
});

export default LearnLibraryPage;