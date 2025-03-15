import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DestinyChart } from '../../../components/destiny-chart/DestinyChart';
import { DivinationHistory } from '../../../components/divination/DivinationHistory';
import { TaskList } from '../../../components/cultivation/TaskList';
import { ProgressBar, EnergyBadge } from '../../../components/common';
import { useDestinyChart, useDivination } from '../../../hooks';
import { fetchUserChart, updateChartData } from '../../../services/chartService';
import { ChartData, GrowthEvent } from '../../../types/chart.types';
import { DivinationResult } from '../../../types/divination.types';
import { LinearGradient } from 'expo-linear-gradient';

// 定义主题颜色
const THEME = {
  deepPurple: '#2E0854', // 深空紫
  mediumPurple: '#4A1B7E', // 中紫色
  lightPurple: '#6B4AA0', // 浅紫色
  gold: '#D4AF37', // 鎏金色
  lightGold: '#F2D675', // 浅金色
  cream: '#FFF8E1', // 奶油色
  white: '#FFFFFF',
  text: '#F9F5FF', // 浅色文本
  darkText: '#1A0E33', // 深色文本
};

const DestinyChartPage: React.FC = () => {
  const userId = 'user-1'; // 实际应用中应从用户会话或上下文中获取
  const { chartData, loading, error, growthHistory, showAnimation, updateFromDivination } = useDestinyChart(userId);
  const { history: divinationHistory, performDivination } = useDivination(userId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // 模拟任务数据
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: '每日冥想',
      description: '完成15分钟的冥想练习，增强精神能量',
      energyReward: 5,
      completed: false,
      type: 'daily' as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 明天
    },
    {
      id: 'task-2',
      title: '记录梦境',
      description: '记录并分析你的梦境内容，获取潜意识洞察',
      energyReward: 8,
      completed: false,
      type: 'daily' as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 明天
    },
    {
      id: 'task-3',
      title: '完成周度反思',
      description: '回顾本周的成长与挑战，设定下周目标',
      energyReward: 15,
      completed: false,
      type: 'weekly' as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 一周后
    }
  ]);
  
  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    // 可以显示节点详情或相关占卜历史
  };
  
  // 处理任务完成
  const handleTaskComplete = (taskId: string) => {
    // 更新任务状态
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true } 
          : task
      )
    );
    
    // 在实际应用中，这里应该调用API来更新任务状态并获取能量奖励
    // 示例中仅模拟能量增加
    const task = tasks.find(t => t.id === taskId);
    if (task && chartData) {
      const mockDivinationResult: DivinationResult = {
        id: `task-div-${Date.now()}`,
        userId,
        type: 'task_reward' as any,
        timestamp: new Date(),
        question: '任务奖励',
        result: {
          symbols: ['任务完成'],
          interpretation: `完成任务: ${task.title}`,
          insights: ['通过日常修行提升能量'],
          energyValue: task.energyReward
        },
        relatedNodeIds: ['node-1'], // 假设任务能量默认流向第一个节点
        energyContribution: task.energyReward
      };
      
      // 更新命盘数据
      updateFromDivination(mockDivinationResult);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载命盘数据中...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>加载失败: {error}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView}>
      <LinearGradient
        colors={[THEME.deepPurple, THEME.mediumPurple]}
        style={styles.headerGradient}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>命运图谱</Text>
          <View style={styles.userLevel}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>等级 {chartData.level}</Text>
            </View>
            <EnergyBadge value={chartData.totalEnergy} size="medium" pulsate={showAnimation} />
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.container}>
        <View style={styles.chartSection}>
          <LinearGradient
            colors={[THEME.gold, THEME.lightGold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>您的命运图谱</Text>
          </LinearGradient>
          <DestinyChart 
            data={chartData}
            level={chartData.level}
            energy={chartData.totalEnergy}
            onNodeClick={handleNodeClick}
            showGrowthAnimation={showAnimation}
          />
        </View>
        
        <View style={styles.growthSection}>
          <LinearGradient
            colors={[THEME.gold, THEME.lightGold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>成长记录</Text>
          </LinearGradient>
          <View style={styles.growthTimeline}>
            {growthHistory.slice(0, 5).map((event: GrowthEvent) => (
              <View key={event.id} style={styles.growthEvent}>
                <View style={styles.eventTimeContainer}>
                  <LinearGradient
                    colors={[THEME.gold, THEME.lightGold]}
                    style={styles.eventTime}
                  >
                    <Text style={styles.eventTimeText}>
                      {new Date(event.timestamp).toLocaleDateString()}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventType}>{event.type}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  <Text style={styles.eventEnergy}>
                    {event.energyChange > 0 ? '+' : ''}{event.energyChange} 能量
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.sideSections}>
          <View style={styles.divinationSection}>
            <LinearGradient
              colors={[THEME.gold, THEME.lightGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleGradient}
            >
              <Text style={styles.title}>占卜历史</Text>
            </LinearGradient>
            <DivinationHistory 
              results={divinationHistory}
              onSelectDivination={(divination) => {
                // 处理选中的占卜结果
                console.log('Selected divination:', divination);
              }}
            />
          </View>
          
          <View style={styles.tasksSection}>
            <LinearGradient
              colors={[THEME.gold, THEME.lightGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleGradient}
            >
              <Text style={styles.title}>修行任务</Text>
            </LinearGradient>
            <TaskList 
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: THEME.deepPurple,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.deepPurple,
  },
  loadingText: {
    marginTop: 16,
    color: THEME.gold,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
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
  chartSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  titleGradient: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.deepPurple,
    textAlign: 'center',
  },
  growthSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  growthTimeline: {
    width: '100%',
  },
  growthEvent: {
    flexDirection: 'row',
    backgroundColor: THEME.lightPurple,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  eventTimeContainer: {
    minWidth: 100,
  },
  eventTime: {
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTimeText: {
    color: THEME.deepPurple,
    fontWeight: 'bold',
  },
  eventContent: {
    flex: 1,
    marginLeft: 10,
  },
  eventType: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: THEME.white,
  },
  eventDescription: {
    color: THEME.text,
  },
  eventEnergy: {
    color: THEME.gold,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sideSections: {
    marginBottom: 16,
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  divinationSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tasksSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default DestinyChartPage;
