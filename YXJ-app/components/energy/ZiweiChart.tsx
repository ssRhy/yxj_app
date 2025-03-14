import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";

// 定义星曜类型
interface Star {
  name: string;
  type: "主星" | "辅星" | "杂耀";
  description: string;
}

// 定义宫位类型
interface Palace {
  name: string;
  position: number; // 1-12
  stars: Star[];
  description: string;
}

// 示例数据 - 在实际应用中，这些数据应该根据用户的出生日期和时间计算
const samplePalaces: Palace[] = [
  {
    name: "命宫",
    position: 1,
    stars: [
      {
        name: "紫微星",
        type: "主星",
        description: "紫微星入命，主贵气，为人正直，有领导才能。",
      },
      {
        name: "天机星",
        type: "主星",
        description: "天机星主智慧，思维敏捷，有创新能力。",
      },
    ],
    description: "命宫代表个人的先天体质、性格特点和人生格局。",
  },
  {
    name: "兄弟宫",
    position: 2,
    stars: [
      {
        name: "武曲星",
        type: "主星",
        description: "武曲星主财富，做事有计划，善于理财。",
      },
    ],
    description: "兄弟宫代表兄弟姐妹关系，以及与同辈人的相处。",
  },
  {
    name: "夫妻宫",
    position: 3,
    stars: [
      {
        name: "天同星",
        type: "主星",
        description: "天同星主仁慈，性格温和，人缘好。",
      },
    ],
    description: "夫妻宫代表婚姻状况、配偶特质和感情生活。",
  },
  {
    name: "子女宫",
    position: 4,
    stars: [
      {
        name: "廉贞星",
        type: "主星",
        description: "廉贞星主正直，有原则，但性格刚烈。",
      },
    ],
    description: "子女宫代表子女缘分、数量和与子女的关系。",
  },
  {
    name: "财帛宫",
    position: 5,
    stars: [
      {
        name: "天府星",
        type: "主星",
        description: "天府星主富贵，财运佳，生活安定。",
      },
    ],
    description: "财帛宫代表财富状况、理财能力和物质生活。",
  },
  {
    name: "疾厄宫",
    position: 6,
    stars: [
      {
        name: "太阳星",
        type: "主星",
        description: "太阳星主光明，性格开朗，有领导魅力。",
      },
    ],
    description: "疾厄宫代表健康状况、疾病倾向和心理健康。",
  },
  {
    name: "迁移宫",
    position: 7,
    stars: [
      {
        name: "太阴星",
        type: "主星",
        description: "太阴星主柔和，直觉敏锐，情感丰富。",
      },
    ],
    description: "迁移宫代表旅行、搬迁和生活环境的变动。",
  },
  {
    name: "奴仆宫",
    position: 8,
    stars: [
      {
        name: "贪狼星",
        type: "主星",
        description: "贪狼星主欲望，追求进取，有野心。",
      },
    ],
    description: "奴仆宫代表下属、助手和与服务人员的关系。",
  },
  {
    name: "官禄宫",
    position: 9,
    stars: [
      {
        name: "巨门星",
        type: "主星",
        description: "巨门星主口才，善于表达，但多思虑。",
      },
    ],
    description: "官禄宫代表事业发展、职位升迁和社会地位。",
  },
  {
    name: "田宅宫",
    position: 10,
    stars: [
      {
        name: "天相星",
        type: "主星",
        description: "天相星主吉祥，心地善良，有助人之心。",
      },
    ],
    description: "田宅宫代表房产、居所和家庭环境。",
  },
  {
    name: "福德宫",
    position: 11,
    stars: [
      {
        name: "天梁星",
        type: "主星",
        description: "天梁星主正直，为人厚道，有责任感。",
      },
    ],
    description: "福德宫代表内心世界、精神追求和生活态度。",
  },
  {
    name: "父母宫",
    position: 12,
    stars: [
      {
        name: "七杀星",
        type: "主星",
        description: "七杀星主刚强，有决断力，但易冲动。",
      },
    ],
    description: "父母宫代表父母关系、长辈缘分和家庭背景。",
  },
];

const ZiweiChart: React.FC = () => {
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [scale, setScale] = useState(1);
  const pan = new Animated.ValueXY();

  // 处理缩放和平移
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // 处理双指缩放
      if (evt.nativeEvent.changedTouches.length > 1) {
        const touch1 = evt.nativeEvent.changedTouches[0];
        const touch2 = evt.nativeEvent.changedTouches[1];

        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
        );

        // 根据手指移动距离调整缩放比例
        const newScale = Math.max(0.5, Math.min(2, scale + distance / 1000));
        setScale(newScale);
      } else {
        // 处理单指平移
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
      }
    },
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  const handlePalacePress = (palace: Palace) => {
    setSelectedPalace(palace);
  };

  const renderPalace = (palace: Palace, index: number) => {
    // 计算宫位在圆形图表中的位置
    const screenWidth = Dimensions.get("window").width;
    const chartSize = screenWidth * 0.8 * scale;
    const centerX = chartSize / 2;
    const centerY = chartSize / 2;
    const radius = chartSize / 3;

    // 计算角度 (12个宫位均匀分布)
    const angle = (index * 30 * Math.PI) / 180;

    // 计算宫位中心点坐标
    const x = centerX + radius * Math.cos(angle) - 40;
    const y = centerY + radius * Math.sin(angle) - 40;

    return (
      <TouchableOpacity
        key={palace.position}
        style={[
          styles.palace,
          {
            left: x,
            top: y,
            backgroundColor:
              selectedPalace?.position === palace.position
                ? "rgba(253, 237, 19, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
          },
        ]}
        onPress={() => handlePalacePress(palace)}
      >
        <Text style={styles.palaceName}>{palace.name}</Text>
        {palace.stars.length > 0 && (
          <Text style={styles.starName}>{palace.stars[0].name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Animated.View
          style={[
            styles.chart,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.chartCenter}>
            <Text style={styles.centerText}>紫微斗数</Text>
          </View>
          {samplePalaces.map((palace, index) => renderPalace(palace, index))}
        </Animated.View>
      </View>

      <View style={styles.detailsContainer}>
        {selectedPalace ? (
          <ScrollView style={styles.detailsScroll}>
            <Text style={styles.detailsTitle}>{selectedPalace.name}</Text>
            <Text style={styles.detailsDescription}>
              {selectedPalace.description}
            </Text>

            <Text style={styles.starsTitle}>入宫星曜:</Text>
            {selectedPalace.stars.map((star, index) => (
              <View key={index} style={styles.starItem}>
                <Text style={styles.starItemName}>
                  {star.name}
                  <Text style={styles.starItemType}> ({star.type})</Text>
                </Text>
                <Text style={styles.starItemDescription}>
                  {star.description}
                </Text>
              </View>
            ))}

            <Text style={styles.hintText}>
              提示: 双指缩放可以调整图表大小，查看更多细节
            </Text>
          </ScrollView>
        ) : (
          <View style={styles.noSelectionContainer}>
            <Text style={styles.noSelectionText}>点击宫位查看详细解读</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  chartContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  chart: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    borderRadius: Dimensions.get("window").width * 0.4,
    borderWidth: 1,
    borderColor: "rgba(253, 237, 19, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  chartCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    borderRadius: 30,
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    color: "#fded13",
    fontWeight: "bold",
    fontSize: 14,
  },
  palace: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(253, 237, 19, 0.3)",
  },
  palaceName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  starName: {
    color: "#fded13",
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  detailsScroll: {
    flex: 1,
  },
  detailsTitle: {
    color: "#fded13",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsDescription: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  starsTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  starItem: {
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 8,
  },
  starItemName: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  starItemType: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "normal",
    fontSize: 14,
  },
  starItemDescription: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSelectionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center",
  },
  hintText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ZiweiChart;
