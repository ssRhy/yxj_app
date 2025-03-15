import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUser } from "../../context/UserContext";

// 定义天干地支类型
interface TianGanDiZhi {
  tianGan: string;
  diZhi: string;
  element: "金" | "木" | "水" | "火" | "土";
  strength: number; // 1-10，表示强弱程度
  description: string;
}

// 定义十神类型
type TenGod = {
  name: string;
  description: string;
  relationship: string;
};

// 定义八字柱子类型
interface BaziPillar {
  tiangan: string;
  dizhi: string;
  tenGod: TenGod;
  hidden: string[];
}

// 定义八字类型
interface BaziData {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;
}

// 示例数据 - 在实际应用中，这些数据应该根据用户的出生日期和时间计算
const sampleBazi: BaziData = {
  year: {
    tiangan: "甲",
    dizhi: "寅",
    tenGod: {
      name: "比肩",
      description: "与日主同性相助，表示合作、竞争",
      relationship: "同性相助",
    },
    hidden: ["甲", "丙", "戊"],
  },
  month: {
    tiangan: "丙",
    dizhi: "午",
    tenGod: {
      name: "食神",
      description: "生助日主，表示才华、创造力",
      relationship: "我生",
    },
    hidden: ["丁", "己"],
  },
  day: {
    tiangan: "甲",
    dizhi: "子",
    tenGod: {
      name: "日主",
      description: "命主本身",
      relationship: "自身",
    },
    hidden: ["癸"],
  },
  hour: {
    tiangan: "壬",
    dizhi: "申",
    tenGod: {
      name: "正官",
      description: "克制日主，表示权威、规矩",
      relationship: "克我",
    },
    hidden: ["庚", "壬", "戊"],
  },
  dayMaster: "甲",
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
  const { user } = useUser();
  const [selectedPillar, setSelectedPillar] = useState<PillarType | null>(null);

  const renderPillar = (type: PillarType, pillar: BaziPillar) => {
    const isSelected = selectedPillar === type;
    return (
      <TouchableOpacity
        style={[
          styles.pillar,
          isSelected && styles.selectedPillar,
          {
            backgroundColor: isSelected
              ? `${
                  elementColors[
                    pillar.tenGod.name as "金" | "木" | "水" | "火" | "土"
                  ]
                }33` // 33 is hex for 20% opacity
              : "rgba(255, 255, 255, 0.1)",
            borderColor:
              elementColors[
                pillar.tenGod.name as "金" | "木" | "水" | "火" | "土"
              ],
          },
        ]}
        onPress={() => setSelectedPillar(isSelected ? null : type)}
      >
        <Text style={styles.pillarTitle}>
          {type === "year"
            ? "年柱"
            : type === "month"
            ? "月柱"
            : type === "day"
            ? "日柱"
            : "时柱"}
        </Text>
        <View style={styles.tianganContainer}>
          <Text style={styles.tianganText}>{pillar.tiangan}</Text>
          <Text style={styles.tenGodText}>{pillar.tenGod.name}</Text>
        </View>
        <View style={styles.dizhiContainer}>
          <Text style={styles.dizhiText}>{pillar.dizhi}</Text>
          <View style={styles.hiddenContainer}>
            {pillar.hidden.map((h, index) => (
              <Text key={index} style={styles.hiddenText}>
                {h}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetails = () => {
    if (!selectedPillar) return null;
    const pillar = sampleBazi[selectedPillar];
    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>十神详解</Text>
        <Text style={styles.detailsName}>{pillar.tenGod.name}</Text>
        <Text style={styles.detailsRelationship}>
          关系：{pillar.tenGod.relationship}
        </Text>
        <Text style={styles.detailsDescription}>
          {pillar.tenGod.description}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {renderPillar("year", sampleBazi.year)}
        {renderPillar("month", sampleBazi.month)}
        {renderPillar("day", sampleBazi.day)}
        {renderPillar("hour", sampleBazi.hour)}
      </View>
      {renderDetails()}
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
  selectedPillar: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    borderColor: "#fded13",
    borderWidth: 1,
  },
  pillarTitle: {
    color: "#fded13",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tianganContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  tianganText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  tenGodText: {
    color: "#fded13",
    fontSize: 12,
    marginTop: 4,
  },
  dizhiContainer: {
    alignItems: "center",
  },
  dizhiText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  hiddenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
  hiddenText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginHorizontal: 2,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 16,
  },
  detailsTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailsName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsRelationship: {
    color: "#fded13",
    fontSize: 16,
    marginBottom: 8,
  },
  detailsDescription: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default BaziChart;
