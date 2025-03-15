import React, { useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useUser } from "../../../context/UserContext";

// 定义健康数据类型
interface HealthData {
  bmi: number;
  bmiStatus: string;
  healthScore: number;
  bmr: number;
  dailyCalories: number;
}

// MBTI描述函数
function getMBTIDescription(mbtiType: string): string {
  const descriptions: Record<string, string> = {
    INTJ: "建筑师型人格 - 富有想象力和战略性的思考者",
    INTP: "逻辑学家型人格 - 创新的发明家",
    ENTJ: "指挥官型人格 - 大胆且具有想象力的领导者",
    ENTP: "辩论家型人格 - 聪明好奇的思考者",
    // ... 可以添加更多MBTI类型描述
  };
  return descriptions[mbtiType] || "暂无描述信息";
};

// 简单的星座描述
function getZodiacDescription(zodiac: string): string {
  const descriptions: Record<string, string> = {
    白羊座: "充满活力、直率、勇敢，是十二星座中最具冒险精神的星座。",
    金牛座: "务实、可靠、耐心，喜欢稳定和安全感，对物质享受有很高的追求。",
    双子座: "聪明、好奇、适应力强，善于沟通和表达，但有时可能显得优柔寡断。",
    巨蟹座: "敏感、情感丰富、有保护欲，非常重视家庭和亲密关系。",
    狮子座: "自信、慷慨、有领导力，喜欢成为关注的焦点，有强烈的自尊心。",
    处女座: "细致、分析能力强、完美主义，注重细节和效率，但有时过于挑剔。",
    天秤座: "和谐、公正、社交能力强，追求平衡与美感，但有时难以做决定。",
    天蝎座: "热情、坚定、神秘，情感深沉且忠诚，但有时过于敏感和固执。",
    射手座: "乐观、自由、哲学思想，喜欢冒险和探索，但有时缺乏耐心。",
    摩羯座: "务实、有抱负、自律，目标明确且有责任感，但有时过于严肃。",
    水瓶座: "独立、创新、人道主义，思想前卫且重视自由，但有时显得疏离。",
    双鱼座: "富有同情心、直觉敏锐、浪漫，有艺术天赋，但有时过于理想化。",
  };

  return descriptions[zodiac] || "暂无描述信息";
};

// 自定义按钮组件
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: FunctionComponent<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#fded13",
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(253, 237, 19, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  editButton: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "500",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dataItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fded13",
  },
  dataLabel: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
  },
  dataStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  dataUnit: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  tipText: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    marginBottom: 12,
  },
  mbtiDescription: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
  },
  zodiacDescription: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
  },
  background: {
    flex: 1,
  },
  button: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "500",
  },
});

// 仪表盘页面组件
const DashboardPage: FunctionComponent = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useUser();

  useEffect(() => {
    if (user) {
      calculateHealthData(user);
    }
    setLoading(false);
  }, [user]);

  function calculateHealthData(user: any) {
    if (user.height && user.weight) {
      const height = user.height / 100; // 转换为米
      const bmi = user.weight / (height * height);
      const bmiStatus = getBMIStatus(bmi);
      const healthScore = calculateHealthScore(bmi);
      const bmr = calculateBMR(user);
      const dailyCalories = bmr * 1.2; // 假设轻度活动水平

      setHealthData({
        bmi,
        bmiStatus,
        healthScore,
        bmr,
        dailyCalories,
      });
    }
  };

  function getBMIStatus(bmi: number): string {
    if (bmi < 18.5) return "偏瘦";
    if (bmi < 24) return "正常";
    if (bmi < 28) return "偏重";
    return "肥胖";
  };

  function calculateHealthScore(bmi: number): number {
    if (bmi >= 18.5 && bmi < 24) return 100;
    if (bmi < 18.5) return 100 - (18.5 - bmi) * 10;
    return 100 - (bmi - 24) * 5;
  };

  function calculateBMR(user: any): number {
    if (!user.weight || !user.height) return 0;
    // 使用Harris-Benedict公式
    const base = user.gender === "male" ? 88.362 : 447.593;
    const weightFactor = user.gender === "male" ? 13.397 : 9.247;
    const heightFactor = user.gender === "male" ? 4.799 : 3.098;
    const ageFactor = user.gender === "male" ? 5.677 : 4.33;

    // 假设年龄为25岁，如果没有出生日期
    const age = user.birthDate
      ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
      : 25;

    return (
      base +
      weightFactor * user.weight +
      heightFactor * user.height -
      ageFactor * age
    );
  };

  function handleLogout() {
    logout().then(() => router.replace("/(routes)/login"));
  };

  function handleEditProfile() {
    router.push("/(routes)/profile/edit");
  };

  function formatDate(dateString: string): string {
    if (!dateString) return "未设置";
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fded13" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>未登录，请先登录</Text>
        <CustomButton
          title="去登录"
          onPress={() => router.replace("/(routes)/login")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(90, 82, 97, 0.4)", "rgba(133, 12, 199, 0.8)"]}
      >
        <ImageBackground
          source={require("../../../assets/background.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.header}>
                <Text style={styles.welcomeText}>
                  欢迎回来，{user.username}
                </Text>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutText}>退出登录</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user.username}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.editButtonText}>编辑资料</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>个人信息</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>性别:</Text>
                  <Text style={styles.infoValue}>
                    {user.gender
                      ? user.gender === "male"
                        ? "男"
                        : user.gender === "female"
                        ? "女"
                        : "其他"
                      : "未设置"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>出生日期:</Text>
                  <Text style={styles.infoValue}>
                    {user.birthDate ? formatDate(user.birthDate) : "未设置"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>星座:</Text>
                  <Text style={styles.infoValue}>
                    {user.zodiacSign || "未设置"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>MBTI:</Text>
                  <Text style={styles.infoValue}>{user.mbti || "未设置"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>八字:</Text>
                  <Text style={styles.infoValue}>
                    {user.chineseBaZi || "未设置"}
                  </Text>
                </View>
              </View>

              {user.mbti && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>MBTI 人格分析</Text>
                  <Text style={styles.mbtiDescription}>
                    {getMBTIDescription(user.mbti)}
                  </Text>
                </View>
              )}

              {user.zodiacSign && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>星座特质</Text>
                  <Text style={styles.zodiacDescription}>
                    {getZodiacDescription(user.zodiacSign)}
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

export default DashboardPage;
