import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import CustomButton from "../../assets/components/CustomButton";
import { useUser } from "../../context/UserContext";

const RegisterForm = () => {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // 用户名验证
    if (!username.trim()) {
      newErrors.username = "请输入用户名";
      isValid = false;
    }

    // 邮箱验证
    if (!email.trim()) {
      newErrors.email = "请输入邮箱";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "请输入有效的邮箱地址";
      isValid = false;
    }

    // 密码验证
    if (!password) {
      newErrors.password = "请输入密码";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "密码长度至少为6位";
      isValid = false;
    }

    // 确认密码验证
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const user = {
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        };

        await login(user);

        Alert.alert("注册成功", "请登录您的账号", [
          {
            text: "确定",
            onPress: () => router.replace("/(routes)/login"),
          },
        ]);
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert("注册失败", "发生错误，请重试");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>创建账号</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>用户名</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入用户名"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
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
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
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
          editable={!isLoading}
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
          editable={!isLoading}
        />
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>

      <CustomButton
        title={isLoading ? "注册中..." : "注册"}
        onPress={handleRegister}
        disabled={isLoading}
        style={styles.registerButton}
      />

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>已有账号？</Text>
        <TouchableOpacity
          onPress={() => router.push("/(routes)/login")}
          disabled={isLoading}
        >
          <Text style={styles.loginLink}>立即登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
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
  errorText: {
    color: "#ff6b6b",
    marginTop: 4,
    fontSize: 14,
  },
  registerButton: {
    marginTop: 20,
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
});

export default RegisterForm;