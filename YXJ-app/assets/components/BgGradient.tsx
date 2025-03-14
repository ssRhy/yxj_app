import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import Content from "./content";

const AppGradient = ({
  children,
  colors,
}: {
  children: any;
  colors: [string, string, ...string[]]; // Ensure at least two colors
}) => {
  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      <Content>{children}</Content>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default AppGradient;
