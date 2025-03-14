import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../../assets/components/CustomButton";
import { router } from "expo-router";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = () => {
    if (!email.trim()) {
      setError("请输入邮箱地址");
      return;
    }

    // 这里可以添加实际的重置密码逻辑，例如API调用
    Alert.alert(
      "重置密码邮件已发送",
      "请查看您的邮箱，按照邮件中的指示重置密码",
      [{ text: "确定", onPress: () => router.push("/login") }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(90, 82, 97, 0.4)", "rgba(111, 197, 36, 0.8)"]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View>
            <Text style={styles.titleText}>忘记密码</Text>
            <Text style={styles.subtitleText}>请输入您的邮箱地址</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>邮箱</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入邮箱"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            <CustomButton title="发送重置邮件" onPress={handleResetPassword} />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="返回登录"
              onPress={() => router.push("/login")}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 30,
  },
  titleText: {
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitleText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
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
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
