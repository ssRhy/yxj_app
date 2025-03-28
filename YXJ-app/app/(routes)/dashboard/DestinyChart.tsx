import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DestinyChart } from "../../../components/destiny-chart/DestinyChart";
import { DivinationHistory } from "../../../components/divination/DivinationHistory";
import { TaskList } from "../../../components/cultivation/TaskList";
import { ProgressBar, EnergyBadge } from "../../../components/common";
import { useDestinyChart, useDivination } from "../../../hooks";
import {
  fetchUserChart,
  updateChartData,
} from "../../../services/chartService";
import { ChartData, GrowthEvent } from "../../../types/chart.types";
import { DivinationResult } from "../../../types/divination.types";
import { LinearGradient } from "expo-linear-gradient";

// 定义主题颜色
const THEME = {
  deepPurple: "#2E0854", // 深空紫
  mediumPurple: "#4A1B7E", // 中紫色
  lightPurple: "#6B4AA0", // 浅紫色
  gold: "#D4AF37", // 鎏金色
  lightGold: "#F2D675", // 浅金色
  cream: "#FFF8E1", // 奶油色
  white: "#FFFFFF",
  text: "#F9F5FF", // 浅色文本
  darkText: "#1A0E33", // 深色文本
};

const DestinyChartPage: React.FC = () => {
  const userId = "user-1"; // 实际应用中应从用户会话或上下文中获取
  const {
    chartData,
    loading,
    error,
    growthHistory,
    showAnimation,
    updateFromDivination,
  } = useDestinyChart(userId);
  const { history: divinationHistory, performDivination } =
    useDivination(userId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // 模拟任务数据
  const [tasks, setTasks] = useState([
    {
      id: "task-1",
      title: "每日冥想",
      description: "完成15分钟的冥想练习，增强精神能量",
      energyReward: 5,
      completed: false,
      type: "daily" as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
    },
    {
      id: "task-2",
      title: "记录梦境",
      description: "记录并分析你的梦境内容，获取潜意识洞察",
      energyReward: 8,
      completed: false,
      type: "daily" as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
    },
    {
      id: "task-3",
      title: "完成周度反思",
      description: "回顾本周的成长与挑战，设定下周目标",
      energyReward: 15,
      completed: false,
      type: "weekly" as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后
    },
  ]);

  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    // 可以显示节点详情或相关占卜历史
  };

  // 处理任务完成
  const handleTaskComplete = (taskId: string) => {
    // 更新任务状态
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    // 在实际应用中，这里应该调用API来更新任务状态并获取能量奖励
    // 示例中仅模拟能量增加
    const task = tasks.find((t) => t.id === taskId);
    if (task && chartData) {
      const mockDivinationResult: DivinationResult = {
        id: `task-div-${Date.now()}`,
        userId,
        type: "task_reward" as any,
        timestamp: new Date(),
        question: "任务奖励",
        result: {
          symbols: ["任务完成"],
          interpretation: `完成任务: ${task.title}`,
          insights: ["通过日常修行提升能量"],
          energyValue: task.energyReward,
        },
        relatedNodeIds: ["node-1"], // 假设任务能量默认流向第一个节点
        energyContribution: task.energyReward,
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

  if (error || !chartData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          加载失败: {error || "未能获取命盘数据"}
        </Text>
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
            <EnergyBadge
              value={chartData.totalEnergy}
              size="medium"
              pulsate={showAnimation}
            />
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
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                  <Text style={styles.eventEnergy}>
                    {event.energyChange > 0 ? "+" : ""}
                    {event.energyChange} 能量
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
                console.log("Selected divination:", divination);
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
            <TaskList tasks={tasks} onTaskComplete={handleTaskComplete} />
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
    paddingTop: 25,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.deepPurple,
    height: "100%",
  },
  loadingText: {
    marginTop: 16,
    color: THEME.gold,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.deepPurple,
    padding: 30,
    height: "100%",
  },
  errorText: {
    color: THEME.gold,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: THEME.gold,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
  },
  retryButtonText: {
    color: THEME.deepPurple,
    fontWeight: "bold",
    fontSize: 16,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.gold,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  userLevel: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    backgroundColor: THEME.gold,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 3,
  },
  levelText: {
    color: THEME.deepPurple,
    fontWeight: "bold",
    fontSize: 16,
  },
  chartSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    maxWidth: 500,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: `${THEME.gold}40`,
  },
  titleGradient: {
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: "center",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.deepPurple,
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  growthSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 15,
    padding: 20,
    marginTop: 25,
    marginBottom: 25,
    marginHorizontal: 10,
    width: "95%",
    maxWidth: 500,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: `${THEME.gold}40`,
  },
  growthTimeline: {
    width: "100%",
  },
  growthEvent: {
    flexDirection: "row",
    backgroundColor: THEME.lightPurple,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: THEME.gold,
  },
  eventTimeContainer: {
    minWidth: 110,
  },
  eventTime: {
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  eventTimeText: {
    color: THEME.deepPurple,
    fontWeight: "bold",
    fontSize: 13,
  },
  eventContent: {
    flex: 1,
    marginLeft: 15,
  },
  eventType: {
    fontWeight: "bold",
    marginBottom: 6,
    color: THEME.white,
    fontSize: 16,
  },
  eventDescription: {
    color: THEME.text,
    lineHeight: 20,
  },
  eventEnergy: {
    color: THEME.gold,
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 15,
  },
  sideSections: {
    marginBottom: 20,
    width: "95%",
    maxWidth: 500,
    alignSelf: "center",
  },
  divinationSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 15,
    padding: 20,
    marginTop: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: `${THEME.gold}40`,
  },
  tasksSection: {
    backgroundColor: THEME.mediumPurple,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: `${THEME.gold}40`,
  },
});

export default DestinyChartPage;
