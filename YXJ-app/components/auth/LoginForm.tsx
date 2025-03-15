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
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "请输入邮箱";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "请输入密码";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // 在实际应用中，这里应该调用API验证用户凭据
        // 这里我们模拟从AsyncStorage获取用户数据
        const userJson = await AsyncStorage.getItem("user_info");

        if (userJson) {
          const userData = JSON.parse(userJson);

          // 简单验证邮箱是否匹配（实际应用中应该验证密码）
          if (userData.email === email) {
            // 登录成功，保存用户数据到上下文
            await login(userData);

            // 直接跳转到dashboard
            router.replace("/(routes)/dashboard");
          } else {
            Alert.alert("登录失败", "邮箱或密码不正确");
          }
        } else {
          Alert.alert("登录失败", "用户不存在，请先注册");
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("登录失败", "发生错误，请重试");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    // 处理忘记密码逻辑
    router.push("/(routes)/forgot-password");
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        <Text style={styles.forgotPasswordText}>忘记密码？</Text>
      </TouchableOpacity>

      <CustomButton
        title={isLoading ? "登录中..." : "登录"}
        onPress={handleLogin}
        disabled={isLoading}
      />

      <View style={styles.registerLinkContainer}>
        <Text style={styles.registerText}>还没有账号？</Text>
        <TouchableOpacity
          onPress={() => router.push("/(routes)/register")}
          disabled={isLoading}
        >
          <Text style={styles.registerLink}>立即注册</Text>
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#fded13",
    fontSize: 14,
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: {
    color: "white",
    fontSize: 14,
  },
  registerLink: {
    color: "#fded13",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default LoginForm;