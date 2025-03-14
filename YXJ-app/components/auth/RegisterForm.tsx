import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { router } from "expo-router";
import CustomButton from "../../assets/components/CustomButton";
import { useUser } from "../../context/UserContext";
import {
  calculateZodiacSign,
  calculateSimpleBaZi,
} from "../../services/UserProfileService";

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

const RegisterForm = () => {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mbti, setMbti] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
    mbti: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      birthDate: "",
      mbti: "",
    };

    if (!username.trim()) {
      newErrors.username = "请输入用户名";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "请输入邮箱";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "请输入有效的邮箱地址";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "请输入密码";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "密码长度至少为6位";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
      isValid = false;
    }

    // 验证性别
    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      newErrors.gender = "请选择有效的性别 (male/female/other)";
      isValid = false;
    }

    // 验证MBTI
    if (mbti && !/^[IE][NS][FT][JP]$/i.test(mbti)) {
      newErrors.mbti = "请输入有效的MBTI类型 (例如: INTJ, ENFP)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        // 计算星座和八字
        const zodiacSign = calculateZodiacSign(birthDate);
        const chineseBaZi = calculateSimpleBaZi(birthDate);

        // 创建用户数据对象
        const userData = {
          username,
          email,
          gender: gender || undefined,
          birthDate: birthDate || undefined,
          zodiacSign: zodiacSign || undefined,
          mbti: mbti ? mbti.toUpperCase() : undefined,
          chineseBaZi: chineseBaZi || undefined,
        };

        // 保存用户数据
        await login(userData);

        // 显示成功消息
        Alert.alert("注册成功", "您已成功注册账号", [
          {
            text: "确定",
            onPress: () => router.push("/(routes)/dashboard"),
          },
        ]);
      } catch (error) {
        Alert.alert("注册失败", "保存用户数据时出错，请重试");
        console.error("Registration error:", error);
      }
    }
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    // 格式化日期为 YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setBirthDate(formattedDate);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>用户名</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入用户名"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入密码"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>确认密码</Text>
          <TextInput
            style={styles.input}
            placeholder="请再次输入密码"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>个人信息（选填）</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>性别</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入性别 (male/female/other)"
            placeholderTextColor="#aaa"
            value={gender}
            onChangeText={setGender}
          />
          {errors.gender ? (
            <Text style={styles.errorText}>{errors.gender}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>出生日期</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={styles.dateInputField}>
              <Text
                style={birthDate ? styles.dateText : styles.datePlaceholder}
              >
                {birthDate || "请选择出生日期"}
              </Text>
            </View>
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
          <TextInput
            style={styles.input}
            placeholder="请输入MBTI类型 (例如: INTJ, ENFP)"
            placeholderTextColor="#aaa"
            value={mbti}
            onChangeText={setMbti}
            autoCapitalize="characters"
            maxLength={4}
          />
          {errors.mbti ? (
            <Text style={styles.errorText}>{errors.mbti}</Text>
          ) : null}
        </View>

        <CustomButton title="注册" onPress={handleRegister} />

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>已有账号？</Text>
          <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
            <Text style={styles.loginLink}>立即登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginVertical: 20,
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
  dateInputField: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  datePlaceholder: {
    color: "#aaa",
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 4,
    fontSize: 14,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    color: "white",
    fontSize: 14,
  },
  loginLink: {
    color: "#fded13",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
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
});

export default RegisterForm;
