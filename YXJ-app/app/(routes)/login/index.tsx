import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../../assets/components/CustomButton";
import { router } from "expo-router";
import LoginForm from "../../../components/auth/LoginForm";
import { ImageBackground } from "react-native";

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          style={styles.gradient}
          colors={["rgba(33, 10, 52, 0.4)", "rgba(46, 36, 78, 0.8)"]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View>
              <Text style={styles.titleText}>账号登录</Text>
              <Text style={styles.subtitleText}>欢迎回来</Text>
            </View>

            <LoginForm />

            <View style={styles.buttonContainer}>
              <CustomButton title="返回首页" onPress={() => router.back()} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
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
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  background: {
    flex: 1,
  },
});
