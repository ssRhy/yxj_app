import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RegisterForm from "../../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          style={styles.gradient}
          colors={["rgba(90, 82, 97, 0.4)", "rgba(111, 197, 36, 0.8)"]}
        >
          <View style={styles.formContainer}>
            <RegisterForm />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  background: {
    flex: 1,
  },
});

export default RegisterPage;
