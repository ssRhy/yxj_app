import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useUser } from "../../../context/UserContext";
import CustomButton from "../../../assets/components/CustomButton";
import {
  calculateZodiacSign,
  calculateSimpleBaZi,
  getAllMBTITypes,
} from "../../../services/UserProfileService";

// 简单的日期选择器组件
const SimpleDatePicker = ({
  visible,
  onClose,
  onSelect,
  currentDate,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  currentDate: Date;
}) => {
  const [year, setYear] = useState(currentDate.getFullYear().toString());
  const [month, setMonth] = useState(
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  );
  const [day, setDay] = useState(
    currentDate.getDate().toString().padStart(2, "0")
  );

  const handleConfirm = () => {
    const selectedDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(selectedDate.getTime())) {
      Alert.alert("无效日期", "请输入有效的日期");
      return;
    }
    onSelect(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>选择日期</Text>

          <View style={styles.dateInputRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>年</Text>
              <TextInput
                style={styles.dateInput}
                value={year}
                onChangeText={setYear}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="YYYY"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>月</Text>
              <TextInput
                style={styles.dateInput}
                value={month}
                onChangeText={setMonth}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>日</Text>
              <TextInput
                style={styles.dateInput}
                value={day}
                onChangeText={setDay}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EditProfilePage = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    birthDate: "",
    mbti: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    gender: "",
    birthDate: "",
    mbti: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showMBTIOptions, setShowMBTIOptions] = useState(false);
  const mbtiTypes = getAllMBTITypes();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        gender: user.gender || "",
        birthDate: user.birthDate || "",
        mbti: user.mbti || "",
      });

      if (user.birthDate) {
        setDate(new Date(user.birthDate));
      }
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      gender: "",
      birthDate: "",
      mbti: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "请输入用户名";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "请输入邮箱";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
      isValid = false;
    }

    // 验证性别
    if (
      formData.gender &&
      !["male", "female", "other"].includes(formData.gender.toLowerCase())
    ) {
      newErrors.gender = "请选择有效的性别 (male/female/other)";
      isValid = false;
    }

    // 验证MBTI
    if (formData.mbti && !/^[IE][NS][FT][JP]$/i.test(formData.mbti)) {
      newErrors.mbti = "请输入有效的MBTI类型 (例如: INTJ, ENFP)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // 计算星座和八字
        const zodiacSign = calculateZodiacSign(formData.birthDate);
        const chineseBaZi = calculateSimpleBaZi(formData.birthDate);

        // 准备更新的数据
        const updatedData = {
          username: formData.username,
          email: formData.email,
          gender: formData.gender || undefined,
          birthDate: formData.birthDate || undefined,
          zodiacSign: zodiacSign || undefined,
          mbti: formData.mbti ? formData.mbti.toUpperCase() : undefined,
          chineseBaZi: chineseBaZi || undefined,
        };

        // 更新用户信息
        await updateUser(updatedData);

        Alert.alert("保存成功", "您的个人资料已更新", [
          {
            text: "确定",
            onPress: () => router.back(),
          },
        ]);
      } catch (error) {
        console.error("Update profile error:", error);
        Alert.alert("保存失败", "更新个人资料时出错，请重试");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    // 格式化日期为 YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setFormData({ ...formData, birthDate: formattedDate });
  };

  const selectMBTI = (mbtiType: string) => {
    setFormData({ ...formData, mbti: mbtiType });
    setShowMBTIOptions(false);
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>未登录，请先登录</Text>
        <CustomButton title="去登录" onPress={() => router.replace("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(90, 82, 97, 0.4)", "rgba(111, 197, 36, 0.8)"]}
      >
        <ImageBackground
          source={require("../../../assets/background.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>返回</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>编辑个人资料</Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.scrollView}>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>用户名</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="请输入用户名"
                    placeholderTextColor="#aaa"
                    value={formData.username}
                    onChangeText={(text) =>
                      setFormData({ ...formData, username: text })
                    }
                    editable={!isLoading}
                  />
                  {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>邮箱</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="请输入邮箱"
                    placeholderTextColor="#aaa"
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  {errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <Text style={styles.sectionTitle}>个人信息</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>性别</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === "male" && styles.selectedGender,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, gender: "male" })
                      }
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === "male" &&
                            styles.selectedGenderText,
                        ]}
                      >
                        男
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === "female" && styles.selectedGender,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, gender: "female" })
                      }
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === "female" &&
                            styles.selectedGenderText,
                        ]}
                      >
                        女
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === "other" && styles.selectedGender,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, gender: "other" })
                      }
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === "other" &&
                            styles.selectedGenderText,
                        ]}
                      >
                        其他
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.gender ? (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>出生日期</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                    disabled={isLoading}
                  >
                    <Text
                      style={
                        formData.birthDate
                          ? styles.dateText
                          : styles.datePlaceholder
                      }
                    >
                      {formData.birthDate || "请选择出生日期"}
                    </Text>
                  </TouchableOpacity>

                  <SimpleDatePicker
                    visible={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onSelect={handleDateSelect}
                    currentDate={date}
                  />

                  {errors.birthDate ? (
                    <Text style={styles.errorText}>{errors.birthDate}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>MBTI人格类型</Text>
                  <TouchableOpacity
                    style={styles.mbtiPickerButton}
                    onPress={() => setShowMBTIOptions(!showMBTIOptions)}
                    disabled={isLoading}
                  >
                    <Text
                      style={
                        formData.mbti ? styles.mbtiText : styles.mbtiPlaceholder
                      }
                    >
                      {formData.mbti || "请选择MBTI类型"}
                    </Text>
                  </TouchableOpacity>
                  {showMBTIOptions && (
                    <View style={styles.mbtiOptionsContainer}>
                      {mbtiTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={styles.mbtiOption}
                          onPress={() => selectMBTI(type)}
                        >
                          <Text style={styles.mbtiOptionText}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  {errors.mbti ? (
                    <Text style={styles.errorText}>{errors.mbti}</Text>
                  ) : null}
                </View>

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={isLoading ? "保存中..." : "保存修改"}
                    onPress={handleSave}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 4,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderOption: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedGender: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
  },
  genderText: {
    color: "white",
    fontSize: 16,
  },
  selectedGenderText: {
    color: "#fded13",
    fontWeight: "bold",
  },
  datePickerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  datePlaceholder: {
    color: "#aaa",
    fontSize: 16,
  },
  mbtiPickerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  mbtiText: {
    color: "white",
    fontSize: 16,
  },
  mbtiPlaceholder: {
    color: "#aaa",
    fontSize: 16,
  },
  mbtiOptionsContainer: {
    backgroundColor: "rgba(40, 40, 40, 0.95)",
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mbtiOption: {
    width: "23%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    margin: 2,
  },
  mbtiOptionText: {
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  dateInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateInputLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  dateInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 10,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  confirmButton: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "500",
  },
  background: {
    flex: 1,
  },
});

export default EditProfilePage;
