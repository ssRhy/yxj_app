import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProfilePage = () => {
  const { user, isLoading, updateUser } = useUser();
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 添加MBTI选项列表
  const mbtiOptions = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

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
          <Text style={styles.loadingText}>加载个人信息中...</Text>
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
            <Text style={styles.errorText}>请先登录查看您的个人信息</Text>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>前往登录</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const navigateToEnergyProfile = () => {
    router.push("/dashboard/energy-profile");
  };

  // 打开编辑模态窗口的函数
  const openEditModal = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue || "");
    setEditModalVisible(true);
  };

  // 保存编辑的函数
  const saveEdit = () => {
    if (editField && user) {
      const updatedUser = { ...user };

      switch (editField) {
        case "username":
          updatedUser.username = editValue;
          break;
        case "gender":
          updatedUser.gender = editValue;
          break;
        case "birthDate":
          updatedUser.birthDate = editValue;
          break;
        case "mbti":
          updatedUser.mbti = editValue;
          break;
      }

      updateUser(updatedUser);
    }

    setEditModalVisible(false);
  };

  // 处理日期变更
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
      setEditValue(formattedDate);
    }
  };

  // 渲染编辑模态窗口内容
  const renderEditModalContent = () => {
    switch (editField) {
      case "username":
        return (
          <TextInput
            style={styles.modalInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder="输入用户名"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        );

      case "gender":
        return (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                editValue === "男" && styles.selectedOption,
              ]}
              onPress={() => setEditValue("男")}
            >
              <Text
                style={[
                  styles.optionText,
                  editValue === "男" && styles.selectedOptionText,
                ]}
              >
                男
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                editValue === "女" && styles.selectedOption,
              ]}
              onPress={() => setEditValue("女")}
            >
              <Text
                style={[
                  styles.optionText,
                  editValue === "女" && styles.selectedOptionText,
                ]}
              >
                女
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                editValue === "其他" && styles.selectedOption,
              ]}
              onPress={() => setEditValue("其他")}
            >
              <Text
                style={[
                  styles.optionText,
                  editValue === "其他" && styles.selectedOptionText,
                ]}
              >
                其他
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "birthDate":
        return (
          <View>
            <Text style={styles.dateInputLabel}>
              请输入出生日期（格式：YYYY-MM-DD）
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="例如：1990-01-01"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.dateInputHint}>日期格式：年份-月份-日期</Text>
          </View>
        );

      case "mbti":
        return (
          <ScrollView style={styles.mbtiContainer}>
            <View style={styles.mbtiOptionsGrid}>
              {mbtiOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.mbtiOption,
                    editValue === option && styles.selectedMbtiOption,
                  ]}
                  onPress={() => setEditValue(option)}
                >
                  <Text
                    style={[
                      styles.mbtiOptionText,
                      editValue === option && styles.selectedMbtiOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      default:
        return null;
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
          <Text style={styles.title}>个人信息</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>基本资料</Text>
            </View>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openEditModal("username", user.username)}
            >
              <View style={styles.infoLabel}>
                <Ionicons name="person-outline" size={20} color="#7b59ff" />
                <Text style={styles.labelText}>用户名</Text>
              </View>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>
                  {user.username || "未设置"}
                </Text>
                <Ionicons name="create-outline" size={16} color="#a0a0ff" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openEditModal("gender", user.gender)}
            >
              <View style={styles.infoLabel}>
                <Ionicons
                  name="male-female-outline"
                  size={20}
                  color="#ff6d93"
                />
                <Text style={styles.labelText}>性别</Text>
              </View>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{user.gender || "未设置"}</Text>
                <Ionicons name="create-outline" size={16} color="#a0a0ff" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openEditModal("birthDate", user.birthDate)}
            >
              <View style={styles.infoLabel}>
                <Ionicons name="calendar-outline" size={20} color="#54d6ba" />
                <Text style={styles.labelText}>出生日期</Text>
              </View>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>
                  {user.birthDate || "未设置"}
                </Text>
                <Ionicons name="create-outline" size={16} color="#a0a0ff" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openEditModal("mbti", user.mbti)}
            >
              <View style={styles.infoLabel}>
                <Ionicons name="people-outline" size={20} color="#fded13" />
                <Text style={styles.labelText}>MBTI类型</Text>
              </View>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{user.mbti || "未设置"}</Text>
                <Ionicons name="create-outline" size={16} color="#a0a0ff" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.energyProfileCard}
            onPress={navigateToEnergyProfile}
          >
            <View style={styles.energyProfileContent}>
              <View>
                <Text style={styles.energyProfileTitle}>我的能量档案</Text>
                <Text style={styles.energyProfileSubtitle}>
                  查看完整的八字、紫微斗数与MBTI分析
                </Text>
              </View>
              <View style={styles.energyProfileIcon}>
                <Ionicons name="pulse" size={32} color="#7b59ff" />
              </View>
            </View>
            <View style={styles.energyProfileFooter}>
              <View style={styles.energyBadge}>
                <Ionicons name="star-outline" size={16} color="#fded13" />
                <Text style={styles.energyBadgeText}>命理能量解析</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* 编辑模态窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editField === "username"
                    ? "编辑用户名"
                    : editField === "gender"
                    ? "选择性别"
                    : editField === "birthDate"
                    ? "设置出生日期"
                    : "选择MBTI类型"}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                {renderEditModalContent()}
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={saveEdit}
                >
                  <Text style={styles.modalSaveButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(123, 89, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(123, 89, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editText: {
    color: "#a0a0ff",
    marginLeft: 4,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 10,
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginRight: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  energyProfileCard: {
    backgroundColor: "rgba(123, 89, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.5)",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  energyProfileContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  energyProfileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  energyProfileSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    maxWidth: "80%",
  },
  energyProfileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  energyProfileFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  energyBadgeText: {
    color: "#fded13",
    marginLeft: 6,
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "rgba(30, 30, 60, 0.95)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(123, 89, 255, 0.3)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 16,
    minHeight: 120,
  },
  modalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  modalCancelButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  modalSaveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(123, 89, 255, 0.6)",
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedOption: {
    backgroundColor: "rgba(123, 89, 255, 0.4)",
    borderWidth: 1,
    borderColor: "#7b59ff",
  },
  optionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
  },
  dateInputLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  dateInputHint: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 8,
    fontStyle: "italic",
  },
  mbtiContainer: {
    maxHeight: 200,
  },
  mbtiOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mbtiOption: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 3,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedMbtiOption: {
    backgroundColor: "rgba(123, 89, 255, 0.4)",
    borderWidth: 1,
    borderColor: "#7b59ff",
  },
  mbtiOptionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  selectedMbtiOptionText: {
    color: "white",
    fontWeight: "500",
  },
});

export default ProfilePage;
