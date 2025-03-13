import React from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/luopan.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          style={styles.gradient}
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View>
              <Text style={styles.welcomeText}>Welcome to the good</Text>
              <Text style={styles.titleText}>Personal App</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 4,
    justifyContent: "space-between",
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
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 100,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
