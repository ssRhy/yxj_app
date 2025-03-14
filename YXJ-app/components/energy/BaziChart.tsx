import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// 定义天干地支类型
interface TianGanDiZhi {
  tianGan: string;
  diZhi: string;
  element: "金" | "木" | "水" | "火" | "土";
  strength: number; // 1-10，表示强弱程度
  description: string;
}

// 定义八字类型
interface BaziData {
  year: TianGanDiZhi;
  month: TianGanDiZhi;
  day: TianGanDiZhi;
  hour: TianGanDiZhi;
  mainElement: "金" | "木" | "水" | "火" | "土";
  luck: string;
  analysis: string;
}

// 示例数据 - 在实际应用中，这些数据应该根据用户的出生日期和时间计算
const sampleBazi: BaziData = {
  year: {
    tianGan: "甲",
    diZhi: "子",
    element: "木",
    strength: 7,
    description: "甲木生于子水之中，水生木，木气旺盛，表现为有创造力和进取心。",
  },
  month: {
    tianGan: "丙",
    diZhi: "寅",
    element: "火",
    strength: 5,
    description:
      "丙火生于寅木之中，木生火，火气中和，表现为热情开朗，有领导才能。",
  },
  day: {
    tianGan: "戊",
    diZhi: "午",
    element: "土",
    strength: 8,
    description:
      "戊土生于午火之中，火生土，土气强盛，表现为踏实稳重，责任感强。",
  },
  hour: {
    tianGan: "庚",
    diZhi: "申",
    element: "金",
    strength: 6,
    description: "庚金生于申金之中，金气得所，表现为果断坚毅，做事有条理。",
  },
  mainElement: "土",
  luck: "近期财运良好，事业有贵人相助，但需注意健康，特别是消化系统。",
  analysis:
    "八字中土气最旺，为人稳重踏实，适合从事与土相关的行业，如房地产、农业、建筑等。木气次之，有创新思维和规划能力。水气偏弱，需注意情绪管理和人际关系的平衡。",
};

// 五行颜色映射
const elementColors = {
  金: "#FFD700",
  木: "#00FF00",
  水: "#1E90FF",
  火: "#FF4500",
  土: "#CD853F",
};

// 定义柱位类型
type PillarType = "year" | "month" | "day" | "hour";

const BaziChart: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarType | null>(null);

  const handlePillarPress = (pillar: PillarType) => {
    setSelectedPillar(pillar);
  };

  const renderPillar = (
    pillar: TianGanDiZhi,
    type: PillarType,
    label: string
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.pillar,
          {
            backgroundColor:
              selectedPillar === type
                ? `${elementColors[pillar.element]}33` // 33 is hex for 20% opacity
                : "rgba(255, 255, 255, 0.1)",
            borderColor: elementColors[pillar.element],
          },
        ]}
        onPress={() => handlePillarPress(type)}
      >
        <Text style={styles.pillarLabel}>{label}</Text>
        <Text style={styles.tianGan}>{pillar.tianGan}</Text>
        <Text style={styles.diZhi}>{pillar.diZhi}</Text>
        <View
          style={[
            styles.elementBadge,
            { backgroundColor: elementColors[pillar.element] },
          ]}
        >
          <Text style={styles.elementText}>{pillar.element}</Text>
        </View>
        <View style={styles.strengthBar}>
          <View
            style={[
              styles.strengthFill,
              {
                width: `${pillar.strength * 10}%`,
                backgroundColor: elementColors[pillar.element],
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {renderPillar(sampleBazi.year, "year", "年柱")}
        {renderPillar(sampleBazi.month, "month", "月柱")}
        {renderPillar(sampleBazi.day, "day", "日柱")}
        {renderPillar(sampleBazi.hour, "hour", "时柱")}
      </View>

      <View style={styles.detailsContainer}>
        {selectedPillar ? (
          <ScrollView style={styles.detailsScroll}>
            <Text style={styles.detailsTitle}>
              {selectedPillar === "year"
                ? "年柱解析"
                : selectedPillar === "month"
                ? "月柱解析"
                : selectedPillar === "day"
                ? "日柱解析"
                : "时柱解析"}
            </Text>
            <Text style={styles.detailsDescription}>
              {sampleBazi[selectedPillar].description}
            </Text>

            <View style={styles.elementAnalysis}>
              <Text style={styles.elementAnalysisTitle}>五行属性:</Text>
              <Text
                style={[
                  styles.elementAnalysisValue,
                  { color: elementColors[sampleBazi[selectedPillar].element] },
                ]}
              >
                {sampleBazi[selectedPillar].element}
              </Text>
            </View>

            <View style={styles.elementAnalysis}>
              <Text style={styles.elementAnalysisTitle}>强度:</Text>
              <Text style={styles.elementAnalysisValue}>
                {sampleBazi[selectedPillar].strength}/10
              </Text>
            </View>

            <Text style={styles.relationTitle}>与其他柱位关系:</Text>
            <View style={styles.relationItem}>
              <Text style={styles.relationItemTitle}>与年柱:</Text>
              <Text style={styles.relationItemValue}>
                {selectedPillar === "year" ? "本柱" : "相生关系"}
              </Text>
            </View>
            <View style={styles.relationItem}>
              <Text style={styles.relationItemTitle}>与月柱:</Text>
              <Text style={styles.relationItemValue}>
                {selectedPillar === "month" ? "本柱" : "相克关系"}
              </Text>
            </View>
            <View style={styles.relationItem}>
              <Text style={styles.relationItemTitle}>与日柱:</Text>
              <Text style={styles.relationItemValue}>
                {selectedPillar === "day" ? "本柱" : "相生关系"}
              </Text>
            </View>
            <View style={styles.relationItem}>
              <Text style={styles.relationItemTitle}>与时柱:</Text>
              <Text style={styles.relationItemValue}>
                {selectedPillar === "hour" ? "本柱" : "中和关系"}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.overviewScroll}>
            <Text style={styles.overviewTitle}>八字命盘总览</Text>
            <Text style={styles.overviewDescription}>
              您的八字命盘为：{sampleBazi.year.tianGan}
              {sampleBazi.year.diZhi} {sampleBazi.month.tianGan}
              {sampleBazi.month.diZhi} {sampleBazi.day.tianGan}
              {sampleBazi.day.diZhi} {sampleBazi.hour.tianGan}
              {sampleBazi.hour.diZhi}
            </Text>

            <View style={styles.mainElementContainer}>
              <Text style={styles.mainElementTitle}>主命五行:</Text>
              <View
                style={[
                  styles.mainElementBadge,
                  { backgroundColor: elementColors[sampleBazi.mainElement] },
                ]}
              >
                <Text style={styles.mainElementText}>
                  {sampleBazi.mainElement}
                </Text>
              </View>
            </View>

            <Text style={styles.analysisTitle}>命盘分析</Text>
            <Text style={styles.analysisText}>{sampleBazi.analysis}</Text>

            <Text style={styles.luckTitle}>运势提示</Text>
            <Text style={styles.luckText}>{sampleBazi.luck}</Text>

            <Text style={styles.hintText}>点击上方柱位查看详细解读</Text>
          </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pillar: {
    width: 70,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  pillarLabel: {
    color: "white",
    fontSize: 12,
    marginBottom: 8,
  },
  tianGan: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  diZhi: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  elementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  elementText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
  strengthBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 16,
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
  elementAnalysis: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  elementAnalysisTitle: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  elementAnalysisValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  relationTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
  },
  relationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 8,
  },
  relationItemTitle: {
    color: "white",
    fontSize: 14,
  },
  relationItemValue: {
    color: "#fded13",
    fontSize: 14,
  },
  overviewScroll: {
    flex: 1,
  },
  overviewTitle: {
    color: "#fded13",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewDescription: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  mainElementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mainElementTitle: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  mainElementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainElementText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  analysisTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  analysisText: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  luckTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  luckText: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
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

export default BaziChart;
