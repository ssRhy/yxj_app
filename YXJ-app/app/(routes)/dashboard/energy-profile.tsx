import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import ZiweiChart from "../../../components/energy/ZiweiChart";
import BaziChart from "../../../components/energy/BaziChart";
import MbtiStarAssociation from "../../../components/energy/MbtiStarAssociation";

// 定义标签类型
type TabType = "bazi" | "ziwei" | "mbti";

const EnergyProfilePage = () => {
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("bazi");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fded13" />
        <Text style={styles.loadingText}>加载能量档案中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>请先登录查看您的能量档案</Text>
      </View>
    );
  }

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
    <View style={styles.container}>
      <Text style={styles.title}>能量档案全息图</Text>
      <Text style={styles.subtitle}>探索您的命理能量结构，了解自我潜能</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "bazi" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("bazi")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "bazi" && styles.activeTabButtonText,
            ]}
          >
            八字命盘
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ziwei" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("ziwei")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "ziwei" && styles.activeTabButtonText,
            ]}
          >
            紫微斗数
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "mbti" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("mbti")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "mbti" && styles.activeTabButtonText,
            ]}
          >
            MBTI与星曜
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contentContainer,
          activeTab === "ziwei" && styles.ziweiContainer,
        ]}
      >
        {renderTabContent()}
      </View>

      <View
        style={[
          styles.suggestionContainer,
          activeTab === "ziwei" && styles.ziweiSuggestionContainer,
        ]}
      >
        <Text style={styles.suggestionTitle}>能量建议</Text>
        <ScrollView style={styles.suggestionScroll}>
          <Text style={styles.suggestionText}>
            根据您的能量档案分析，建议您在日常生活中注意以下几点：
          </Text>
          <View style={styles.suggestionItem}>
            <Text style={styles.suggestionItemTitle}>能量平衡</Text>
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
            <Text style={styles.suggestionItemTitle}>人际关系</Text>
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
            <Text style={styles.suggestionItemTitle}>事业发展</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fded13",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 24,
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
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  activeTabButton: {
    borderBottomColor: "#fded13",
  },
  tabButtonText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  activeTabButtonText: {
    color: "#fded13",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  ziweiContainer: {
    flex: 2,
    marginBottom: 8,
  },
  suggestionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxHeight: 300,
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
    color: "#fded13",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "white",
    marginBottom: 12,
  },
  suggestionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  suggestionItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fded13",
    marginBottom: 4,
  },
  suggestionItemText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
});

export default EnergyProfilePage;
