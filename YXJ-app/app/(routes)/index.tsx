import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useUser } from "../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const { user } = useUser();

  const navigateToDashboard = () => {
    router.push("/(routes)/dashboard");
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["#2e1f58", "#54426b", "#a790af"]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>应用首页</Text>
        <Text style={styles.welcomeText}>
          欢迎使用，{user?.username || "用户"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={navigateToDashboard}>
          <Text style={styles.buttonText}>进入仪表盘</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "500",
  },
});
