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
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          marginTop: 16,
          color: '#718096',
        }}>加载命盘数据中...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          color: '#e53e3e',
        }}>加载失败: {error}</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>命运图谱</Text>
          <View style={styles.userLevel}>
            <Text style={styles.levelText}>等级 {chartData.level}</Text>
            <EnergyBadge value={chartData.totalEnergy} size="medium" pulsate={showAnimation} />
          </View>
        </View>
        
        <View style={styles.chartSection}>
          <Text style={styles.title}>您的命运图谱</Text>
          <DestinyChart 
            data={chartData}
            level={chartData.level}
            energy={chartData.totalEnergy}
            onNodeClick={handleNodeClick}
            showGrowthAnimation={showAnimation}
          />
        </View>
        
        <View style={styles.growthSection}>
          <Text style={styles.title}>成长记录</Text>
          <View style={styles.growthTimeline}>
            {growthHistory.slice(0, 5).map((event: GrowthEvent) => (
              <View key={event.id} style={styles.growthEvent}>
                <View style={styles.eventTime}>
                  <Text style={styles.eventTimeText}>
                    {new Date(event.timestamp).toLocaleDateString()}
                  </Text>
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
            <DivinationHistory 
              results={divinationHistory}
              onSelectDivination={(divination) => {
                // 处理选中的占卜结果
                console.log('Selected divination:', divination);
              }}
            />
          </View>
          
          <View style={styles.tasksSection}>
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
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    width: '100%',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    marginRight: 12,
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  growthSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  growthTimeline: {
    width: '100%',
  },
  growthEvent: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  eventTime: {
    minWidth: 100,
  },
  eventTimeText: {
    color: '#718096',
  },
  eventContent: {
    flex: 1,
  },
  eventType: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDescription: {
    color: '#4a5568',
  },
  eventEnergy: {
    color: '#48bb78',
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  tasksSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
});

export default DestinyChartPage;
