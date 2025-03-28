import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { router, Redirect } from "expo-router";

export default function HomeScreen() {
  // 直接重定向到仪表盘页面，不要求登录
  return <Redirect href="/dashboard" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 30,
  },
  welcomeText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    marginTop: 16,
  },
  titleText: {
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingBottom: 50,
    alignItems: "center",
  },
});
