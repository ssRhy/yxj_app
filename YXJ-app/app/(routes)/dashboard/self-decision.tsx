import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Import our custom components
import DualTimeline from "../../../assets/components/DualTimeline";
import FoldingMenu from "../../../assets/components/FoldingMenu";

console.log("DualTimeline:", DualTimeline);
console.log("FoldingMenu:", FoldingMenu);

export default function SelfDecisionScreen() {
  const [selectedDate, setSelectedDate] = useState("2025-03-15");
  const [selectedLunarDate, setSelectedLunarDate] = useState("二月十五");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [selectedChildCategory, setSelectedChildCategory] = useState<
    string | null
  >(null);

  // Handler for date selection from timeline
  const handleDateSelect = (date: string, lunarDate: string) => {
    setSelectedDate(date);
    setSelectedLunarDate(lunarDate);
  };

  // Handler for category selection from folding menu
  const handleCategorySelect = (
    category: string,
    subcategory?: string,
    childCategory?: string
  ) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || null);
    setSelectedChildCategory(childCategory || null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header with Expo Router Stack Navigator */}
      <Stack.Screen
        options={{
          title: "做决策",
          headerStyle: {
            backgroundColor: "#f5f5f5",
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollContainer}>
        {/* Current selection summary */}
        <View style={styles.selectionSummary}>
          <Text style={styles.dateDisplay}>
            {selectedDate} ({selectedLunarDate})
          </Text>
          {selectedCategory && (
            <View style={styles.categoryPath}>
              <Text style={styles.categoryPathText}>
                {selectedCategory}
                {selectedSubcategory && ` > ${selectedSubcategory}`}
                {selectedChildCategory && ` > ${selectedChildCategory}`}
              </Text>
            </View>
          )}
        </View>

        {/* Dual Calendar Timeline Component */}
        <DualTimeline onDateSelect={handleDateSelect} />

        {/* Decision Types Folding Menu Component */}
        <FoldingMenu onCategorySelect={handleCategorySelect} />

        {/* Placeholder for parameter settings */}
        <View style={styles.parametersContainer}>
          <Text style={styles.sectionTitle}>维度数据回放</Text>
          <View style={styles.parameterPlaceholder} className="flex flex-row justify-between ">
            <Text style={styles.placeholderText}>生物数据在这里显示</Text>
          </View>
          <View style={styles.parameterPlaceholder}>
            <Text style={styles.placeholderText}>维度参数设置将在此处显示</Text>
            {/* 组件1Future parameters component will be placed here */}
          </View>
        </View>

        {/* Placeholder for decision result */}
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>因果关联</Text>
          <View style={styles.resultPlaceholder}>
            <View className="flex flex-col">
              <Text style={styles.placeholderText}>决策结果将在此处显示</Text>
            </View>
            {/* 组件2Future result component will be placed here */}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>生成决策建议</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  selectionSummary: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateDisplay: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  categoryPath: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryPathText: {
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parametersContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  parameterPlaceholder: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  resultContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  resultPlaceholder: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#999",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
