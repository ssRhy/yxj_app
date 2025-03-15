import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";
import ZiweiChart from "../../../components/energy/ZiweiChart";
import BaziChart from "../../../components/energy/BaziChart";
import MbtiStarAssociation from "../../../components/energy/MbtiStarAssociation";

// 获取屏幕尺寸
const { width, height } = Dimensions.get("window");

// 定义标签类型
type TabType = "bazi" | "ziwei" | "mbti";

const EnergyProfilePage = () => {
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("bazi");

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#0a0531", "#3F16D3", "#24243e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7b59ff" />
          <Text style={styles.loadingText}>加载能量档案中...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient
        colors={["#0a0531", "#3F16D3", "#24243e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={50} color="#ff6b8b" />
            <Text style={styles.errorText}>请先登录查看您的能量档案</Text>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>前往登录</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const getTabIcon = (tab: TabType): string => {
    switch (tab) {
      case "bazi":
        return "grid-outline";
      case "ziwei":
        return "star-outline";
      case "mbti":
        return "people-outline";
      default:
        return "grid-outline";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "bazi":
        return <BaziChart />;
      case "ziwei":
        return <ZiweiChart />;
      case "mbti":
        return <MbtiStarAssociation />;
      default:
        return <BaziChart />;
    }
  };

  return (
    <LinearGradient
      colors={["#0a0531", "#3F16D3", "#24243e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>能量档案全息图</Text>
            <Text style={styles.subtitle}>
              探索您的命理能量结构，了解自我潜能
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {["bazi", "ziwei", "mbti"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab as TabType)}
            >
              <Ionicons
                name={getTabIcon(tab as TabType) as any}
                size={20}
                color={activeTab === tab ? "white" : "rgba(255, 255, 255, 0.6)"}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.activeTabButtonText,
                ]}
              >
                {tab === "bazi"
                  ? "八字命盘"
                  : tab === "ziwei"
                  ? "紫微斗数"
                  : "MBTI与星曜"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.contentContainer,
            activeTab === "ziwei" && styles.ziweiContainer,
          ]}
        >
          <View style={styles.cardContainer}>{renderTabContent()}</View>
        </View>

        <View
          style={[
            styles.suggestionContainer,
            activeTab === "ziwei" && styles.ziweiSuggestionContainer,
          ]}
        >
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>能量建议</Text>
            <TouchableOpacity>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#a0a0ff"
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.suggestionScroll}>
            <Text style={styles.suggestionText}>
              根据您的能量档案分析，建议您在日常生活中注意以下几点：
            </Text>

            <View style={styles.suggestionItem}>
              <View style={styles.suggestionItemHeader}>
                <Ionicons name="flash-outline" size={20} color="#7b59ff" />
                <Text style={styles.suggestionItemTitle}>能量平衡</Text>
              </View>
              <Text style={styles.suggestionItemText}>
                您的
                {activeTab === "bazi"
                  ? "八字"
                  : activeTab === "ziwei"
                  ? "紫微"
                  : "MBTI"}
                显示
                {activeTab === "bazi"
                  ? "土气较旺，建议多接触水元素环境，如靠近湖泊、海洋，或在家中摆放水景。"
                  : activeTab === "ziwei"
                  ? "命宫有紫微天机同宫，思维活跃但易过度思考，建议通过冥想放松心神。"
                  : `您的${
                      user.mbti || "INFJ"
                    }类型适合创造性工作，建议在工作中寻找更多发挥创意的机会。`}
              </Text>
            </View>

            <View style={styles.suggestionItem}>
              <View style={styles.suggestionItemHeader}>
                <Ionicons name="people-outline" size={20} color="#7b59ff" />
                <Text style={styles.suggestionItemTitle}>人际关系</Text>
              </View>
              <Text style={styles.suggestionItemText}>
                {activeTab === "bazi"
                  ? "八字中木气次旺，人际关系中宜柔和有度，避免过于强势。"
                  : activeTab === "ziwei"
                  ? "夫妻宫有天同星，感情生活温和稳定，但需要主动表达情感。"
                  : `作为${
                      user.mbti || "INFJ"
                    }类型，您在人际关系中较为理想主义，建议培养更多实际沟通技巧。`}
              </Text>
            </View>

            <View style={styles.suggestionItem}>
              <View style={styles.suggestionItemHeader}>
                <Ionicons name="briefcase-outline" size={20} color="#7b59ff" />
                <Text style={styles.suggestionItemTitle}>事业发展</Text>
              </View>
              <Text style={styles.suggestionItemText}>
                {activeTab === "bazi"
                  ? "日主天干为戊土，事业上适合稳扎稳打，循序渐进，不宜冒进。"
                  : activeTab === "ziwei"
                  ? "官禄宫有巨门星，事业上善于表达和沟通，适合从事需要口才的工作。"
                  : `您的${
                      user.mbti || "INFJ"
                    }性格特质适合需要创新思维和独立工作的职业，如研究、设计或咨询工作。`}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(123, 89, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorCard: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b8b",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "rgba(123, 89, 255, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#7b59ff",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  tabContainer: {
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
  tabButtonText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: "white",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  ziweiContainer: {
    flex: 2,
    marginBottom: 8,
  },
  cardContainer: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
  },
  suggestionContainer: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ziweiSuggestionContainer: {
    maxHeight: 200,
    padding: 12,
  },
  suggestionScroll: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
  },
  suggestionItem: {
    backgroundColor: "rgba(60, 60, 100, 0.5)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.2)",
  },
  suggestionItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  suggestionItemText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
});

export default EnergyProfilePage;
