import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface TimelineMarker {
  date: string;
  lunarDate: string;
  solarTerm?: string;
}

interface DualTimelineProps {
  onDateSelect: (date: string, lunarDate: string) => void;
}

const DualTimeline: React.FC<DualTimelineProps> = ({ onDateSelect }) => {
  // Sample data - this would normally come from a date calculation library
  const [currentIndex, setCurrentIndex] = useState(15); // Default to today
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate sample timeline data
  const generateTimelineData = (): TimelineMarker[] => {
    const data: TimelineMarker[] = [];

    // In a real app, you'd use a proper calendar library to generate dates
    // This is just sample data for visualization
    for (let i = 0; i < 30; i++) {
      const day = i + 1;
      const date = `2025-03-${day < 10 ? "0" + day : day}`;
      const lunarDate = `二月${convertToChineseNumber(day)}`;

      // Add solar terms for some specific dates
      let solarTerm;
      if (day === 5) solarTerm = "惊蛰";
      if (day === 20) solarTerm = "春分";

      data.push({ date, lunarDate, solarTerm });
    }

    return data;
  };

  const timelineData = generateTimelineData();

  // Convert numbers to Chinese representation
  function convertToChineseNumber(num: number): string {
    const chineseNumbers = [
      "初一",
      "初二",
      "初三",
      "初四",
      "初五",
      "初六",
      "初七",
      "初八",
      "初九",
      "初十",
      "十一",
      "十二",
      "十三",
      "十四",
      "十五",
      "十六",
      "十七",
      "十八",
      "十九",
      "二十",
      "廿一",
      "廿二",
      "廿三",
      "廿四",
      "廿五",
      "廿六",
      "廿七",
      "廿八",
      "廿九",
      "三十",
    ];
    return chineseNumbers[num - 1] || "";
  }

  // Scroll to date
  const scrollToDate = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (width * 0.2),
      animated: true,
    });

    const { date, lunarDate } = timelineData[index];
    onDateSelect(date, lunarDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>时间轴</Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => scrollToDate(15)} // Assuming index 15 is "today"
        >
          <Text style={styles.todayButtonText}>今天</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timelineContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => scrollToDate(Math.max(0, currentIndex - 1))}
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={width * 0.2}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (width * 0.2)
            );
            setCurrentIndex(index);
            const { date, lunarDate } = timelineData[index];
            onDateSelect(date, lunarDate);
          }}
        >
          {timelineData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                currentIndex === index && styles.selectedDateItem,
              ]}
              onPress={() => scrollToDate(index)}
            >
              <Text
                style={[
                  styles.gregorianDate,
                  currentIndex === index && styles.selectedText,
                ]}
              >
                {item.date.split("-")[2]}
              </Text>
              <Text
                style={[
                  styles.lunarDate,
                  currentIndex === index && styles.selectedText,
                ]}
              >
                {item.lunarDate}
              </Text>
              {item.solarTerm && (
                <View style={styles.solarTermMarker}>
                  <Text style={styles.solarTermText}>{item.solarTerm}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() =>
            scrollToDate(Math.min(timelineData.length - 1, currentIndex + 1))
          }
        >
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  todayButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  todayButtonText: {
    fontSize: 12,
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
  },
  arrowButton: {
    padding: 5,
  },
  scrollContent: {
    alignItems: "center",
  },
  dateItem: {
    width: width * 0.2,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  selectedDateItem: {
    backgroundColor: "#007AFF",
  },
  gregorianDate: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lunarDate: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedText: {
    color: "white",
  },
  solarTermMarker: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF9500",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  solarTermText: {
    color: "white",
    fontSize: 10,
  },
});

export default DualTimeline;
