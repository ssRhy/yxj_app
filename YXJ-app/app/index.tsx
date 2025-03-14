import React from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import CustomButton from "../assets/components/CustomButton";
import BgGradient from "../assets/components/BgGradient";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.background}
        resizeMode="cover"
        onError={(e) =>
          console.error("Image loading error:", e.nativeEvent.error)
        }
      >
        <BgGradient
          colors={["rgba(29, 3, 51, 0.4).4)", "rgba(174, 149, 65, 0.8))"]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View>
              <Text style={styles.welcomeText}>Welcome to the good </Text>
              <Text style={styles.titleText}>Personal App</Text>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Start"
                onPress={() => router.push("/(routes)/register")}
              />
            </View>
          </SafeAreaView>
        </BgGradient>
      </ImageBackground>
    </View>
  );
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
