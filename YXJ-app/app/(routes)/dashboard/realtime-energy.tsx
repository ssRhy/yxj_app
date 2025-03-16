// 使用我们刚刚创建的能量上下文和服务：
// 历史标签页现在显示从上下文中获取的真实数据
// 添加了加载状态和空数据状态的处理
// 添加了下拉刷新功能
// 详情标签页也使用了真实数据
// 刷新按钮现在可以真正刷新数据

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEnergy } from "../../../contexts/EnergyContext";

// 获取屏幕尺寸
const { width, height } = Dimensions.get("window");

// 定义组件接口
interface RealtimeEnergyProps {
  // 如有需要，添加props类型
}

// 概览组件
const OverviewTab: React.FC = () => {
  return (
    <View style={styles.mainContent}>
      {/* 生物热力图 */}
      <View style={styles.moduleContainer}>
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>生物热力图</Text>
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#a0a0ff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.heatmapContainer}>
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>生物热力图显示区域</Text>
          </View>
        </View>
      </View>

      {/* 环境能量球 */}
      <View style={styles.moduleContainer}>
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>环境能量球</Text>
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#a0a0ff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.energyBallContainer}>
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>环境能量球显示区域</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// 详情组件
const DetailsTab: React.FC = () => {
  const { currentEnergy, loading } = useEnergy();
  
  return (
    <View style={styles.mainContent}>
      <View style={styles.moduleContainer}>
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>能量详情</Text>
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#a0a0ff"
            />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a0a0ff" />
            <Text style={styles.loadingText}>加载数据中...</Text>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            {/* 数据源指示器 */}
            <View style={styles.dataSourceContainer}>
              <Text style={styles.dataSourceLabel}>数据源:</Text>
              <View style={[
                styles.dataSourceIndicator, 
                currentEnergy?.source === 'hardware' ? styles.hardwareSource : styles.simulatedSource
              ]}>
                <Text style={styles.dataSourceText}>
                  {currentEnergy?.source === 'hardware' ? '硬件设备' : '模拟数据'}
                </Text>
              </View>
            </View>

            {/* 能量分布图 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>能量分布</Text>
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>能量分布图显示区域</Text>
              </View>
            </View>

            {/* 参数指标 */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>强度</Text>
                <Text style={styles.statValue}>{currentEnergy?.intensity || '未知'}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>频率</Text>
                <Text style={styles.statValue}>{Math.round(((currentEnergy?.intensity || 80) * 1.5) + 10)} Hz</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>波动性</Text>
                <Text style={styles.statValue}>{currentEnergy?.status === '波动' ? '高' : '低'}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>稳定度</Text>
                <Text style={styles.statValue}>{Math.round(100 - ((currentEnergy?.intensity || 80) % 10))}%</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// 历史组件
const HistoryTab: React.FC = () => {
  const { historyRecords, loading, refreshEnergy } = useEnergy();

  return (
    <ScrollView 
      style={styles.mainContent}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshEnergy} />
      }
    >
      <View style={styles.moduleContainer}>
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>历史记录</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={18} color="#a0a0ff" />
            <Text style={styles.filterText}>筛选</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a0a0ff" />
            <Text style={styles.loadingText}>加载数据中...</Text>
          </View>
        ) : historyRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无历史记录</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {historyRecords.map((item, index) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeftSection}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text
                    style={[
                      styles.historyStatus,
                      item.status === "正常"
                        ? styles.statusNormal
                        : item.status === "波动"
                        ? styles.statusWarning
                        : item.status === "高能量"
                        ? styles.statusHigh
                        : styles.statusAlert,
                    ]}
                  >
                    {item.status}
                  </Text>
                  {item.source && (
                    <View style={[
                      styles.historySourceIndicator,
                      item.source === 'hardware' ? styles.hardwareSource : styles.simulatedSource
                    ]}>
                      <Text style={styles.historySourceText}>
                        {item.source === 'hardware' ? '硬件' : '模拟'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.historyRightSection}>
                  <Text style={styles.historyIntensityLabel}>能量强度</Text>
                  <Text style={styles.historyIntensityValue}>
                    {item.intensity}
                  </Text>
                </View>
                <TouchableOpacity style={styles.historyDetailsButton}>
                  <Ionicons name="chevron-forward" size={20} color="#a0a0ff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const RealtimeEnergy: React.FC<RealtimeEnergyProps> = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { refreshEnergy } = useEnergy();

  // 初始加载数据
  useEffect(() => {
    refreshEnergy();
  }, []);

  // 渲染子导航栏
  const renderSubNavigation = () => {
    return (
      <View style={styles.subNavContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "overview" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("overview")}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color={
              activeTab === "overview" ? "white" : "rgba(255, 255, 255, 0.6)"
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            概览
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "details" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={20}
            color={
              activeTab === "details" ? "white" : "rgba(255, 255, 255, 0.6)"
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "details" && styles.activeTabText,
            ]}
          >
            详情
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "history" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={
              activeTab === "history" ? "white" : "rgba(255, 255, 255, 0.6)"
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            历史
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染基于当前活动标签的内容
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "details":
        return <DetailsTab />;
      case "history":
        return <HistoryTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0531", "#3F16D3", "#24243e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.titleText}>多维感知</Text>
              <Text style={styles.subtitleText}>3D视图</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={refreshEnergy}
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* 子导航栏 */}
          {renderSubNavigation()}

          {/* 基于活动标签的内容 */}
          {renderContent()}

          {/* Footer navigation can be added here if needed */}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(123, 89, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#a0a0ff",
    marginTop: 5,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  // 子导航栏样式
  subNavContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 12,
    marginBottom: 20,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "rgba(123, 89, 255, 0.3)",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 6,
    fontSize: 14,
  },
  activeTabText: {
    color: "white",
    fontWeight: "500",
  },

  // 主要内容区域样式
  mainContent: {
    flex: 1,
  },
  moduleContainer: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  moduleTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  heatmapContainer: {
    height: height * 0.22,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  energyBallContainer: {
    height: height * 0.22,
    borderRadius: 12,
    overflow: "hidden",
  },
  placeholderBox: {
    flex: 1,
    backgroundColor: "rgba(60, 60, 100, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.2)",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },

  // 详情标签页样式
  detailsContainer: {
    paddingBottom: 10,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailSectionTitle: {
    fontSize: 16,
    color: "#a0a0ff",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  statItem: {
    width: "48%",
    backgroundColor: "rgba(60, 60, 100, 0.5)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // 历史标签页样式
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(60, 60, 100, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  filterText: {
    color: "#a0a0ff",
    fontSize: 14,
    marginLeft: 4,
  },
  historyList: {
    marginTop: 5,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  historyLeftSection: {
    flex: 1,
  },
  historyDate: {
    color: "white",
    fontSize: 15,
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusNormal: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    color: "#4CAF50",
  },
  statusWarning: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    color: "#FFC107",
  },
  statusAlert: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    color: "#F44336",
  },
  statusHigh: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    color: "#FFA07A",
  },
  historyRightSection: {
    alignItems: "flex-end",
    marginRight: 15,
  },
  historyIntensityLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  historyIntensityValue: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  historyDetailsButton: {
    padding: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#a0a0ff',
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },

  // 数据源样式
  dataSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dataSourceLabel: {
    fontSize: 14,
    color: '#fff',
    marginRight: 10,
  },
  dataSourceIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dataSourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hardwareSource: {
    backgroundColor: '#4CAF50',
  },
  simulatedSource: {
    backgroundColor: '#FFC107',
  },
  // 历史记录数据源指示器
  historySourceIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  historySourceText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
  },
});

export default RealtimeEnergy;
