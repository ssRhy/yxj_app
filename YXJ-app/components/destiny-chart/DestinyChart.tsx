import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { ChartNode } from "./ChartNode";
import { DestinyLine } from "./DestinyLine";
import { EnergyIndicator } from "./EnergyIndicator";
import {
  ChartData,
  ChartNode as NodeType,
  GrowthEvent,
} from "../../types/chart.types";
import { useRef, useState, useEffect } from "react";

interface DestinyChartProps {
  data: ChartData;
  level: number;
  energy: number;
  onNodeClick?: (nodeId: string) => void;
  showGrowthAnimation?: boolean;
}

// 优化部分常数
const CHART_COLORS = {
  activeNode: "#E5C158", // 金色
  activeGlow: "rgba(229, 193, 88, 0.35)",
  unlockedNode: "#59378E", // 紫色
  unlockedBorder: "rgba(229, 193, 88, 0.5)",
  lockedNode: "#1A0A33", // 深紫色
  lockedBorder: "rgba(89, 55, 142, 0.5)",
  activeLine: "#E5C158", // 金色
  inactiveLine: "rgba(229, 193, 88, 0.25)",
  background: "rgba(26, 10, 51, 0.8)",
  backgroundPattern: "rgba(229, 193, 88, 0.15)",
  nodeText: "#FFF",
  nodeLabelActive: "#F9E07F",
  nodeLabelLocked: "#9A87C4",
};

export const DestinyChart: React.FC<DestinyChartProps> = ({
  data,
  level,
  energy,
  onNodeClick,
  showGrowthAnimation = false,
}) => {
  const chartRef = useRef(null);
  const [animatingNode, setAnimatingNode] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const [stars, setStars] = useState([]);

  // 处理图谱渲染逻辑
  useEffect(() => {
    if (!data) return;

    // 这里可以使用React Native的动画或SVG库来渲染图谱
    // 示例中仅提供React Native渲染方式
  }, [data]);

  // 处理成长动画效果
  useEffect(() => {
    if (showGrowthAnimation && data.growthHistory.length > 0) {
      // 获取最新的成长事件
      const latestEvent = data.growthHistory[data.growthHistory.length - 1];

      if (latestEvent.nodeId) {
        // 设置动画节点
        setAnimatingNode(latestEvent.nodeId);

        // 开始脉动动画
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 动画结束后清除
          setAnimatingNode(null);
        });

        return () => {
          pulseAnim.setValue(0.5);
        };
      }
    }
  }, [showGrowthAnimation, data.growthHistory, pulseAnim]);

  // 添加到useEffect部分
  useEffect(() => {
    if (!data) return;

    // 创建星空背景效果
    if (chartRef.current) {
      const stars = [];
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.5;
        stars.push({
          id: `star-${i}`,
          size,
          opacity,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: Math.random() * 3000 + 2000,
        });
      }
      setStars(stars);
    }
  }, [data]);

  // 节点点击处理
  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
    // 额外的节点点击逻辑
  };

  // 渲染节点
  const renderNodes = () => {
    if (!data || !data.nodes) return null;

    // 计算中心偏移并调整缩放比例，使节点布局更美观
    const centerOffsetX = 100;
    const centerOffsetY = 100;
    const scaleFactor = 0.9; // 减小缩放因子，使节点分布更广

    return data.nodes.map((node) => {
      // 节点动画状态
      const isAnimating = animatingNode === node.id;

      // 确定节点状态: 活跃、已解锁但未激活、锁定
      const isActive = node.requiredLevel <= level && node.energy > 0;
      const isUnlocked = node.requiredLevel <= level;
      const isLocked = node.requiredLevel > level;

      // 根据节点类型确定图标
      const getNodeIcon = () => {
        switch (node.type) {
          case "spiritual":
            return require("../../assets/icons/spiritual.png");

          case "emotional":
            return require("../../assets/icons/emotional.png");
          case "physical":
            return require("../../assets/icons/physical.png");
          case "mental":
            return require("../../assets/icons/mental.png");
          case "social":
            return require("../../assets/icons/social.png");
          default:
            return null;
        }
      };

      const nodeIcon = getNodeIcon();

      return (
        <TouchableOpacity
          key={node.id}
          style={[
            styles.nodeWrapper,
            {
              left: centerOffsetX + node.position.x / scaleFactor,
              top: centerOffsetY + node.position.y / scaleFactor,
              transform: [{ scale: isAnimating ? 1.2 : 1 }],
            },
          ]}
          onPress={() => handleNodeClick(node.id)}
          disabled={isLocked}
        >
          <View
            style={[
              styles.node,
              isActive && styles.nodeActive,
              isUnlocked && !isActive && styles.nodeUnlocked,
              isLocked && styles.nodeLocked,
            ]}
          >
            {/* 节点内部 */}
            <View style={styles.nodeInner}>
              {nodeIcon && (
                <Image
                  source={nodeIcon}
                  style={styles.nodeIcon}
                  onError={(e) =>
                    console.error("图标加载失败:", e.nativeEvent.error)
                  }
                  onLoad={() => console.log("图标加载成功")}
                />
              )}
              <Text
                style={[
                  styles.nodeEnergyText,
                  isLocked && styles.nodeEnergyTextLocked,
                ]}
              >
                {node.energy}
              </Text>
            </View>
          </View>
          <Text style={[styles.nodeLabel, isLocked && styles.nodeLabelLocked]}>
            {node.name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // 渲染命运线
  const renderLines = () => {
    // 计算中心偏移，使用更合适的偏移量
    const centerOffsetX = 150; // 保持偏移量
    const centerOffsetY = 150; // 保持偏移量
    const scaleFactor = 0.5; // 进一步减小缩放因子，使节点分布更开

    return data.lines.map((line) => {
      // 找到源节点和目标节点
      const sourceNode = data.nodes.find((node) => node.id === line.sourceId);
      const targetNode = data.nodes.find((node) => node.id === line.targetId);

      if (!sourceNode || !targetNode) return null;

      // 反转坐标系方向，并添加中心偏移，使用更合适的缩放比例
      const x1 = centerOffsetX - sourceNode.position.x / scaleFactor;
      const y1 = centerOffsetY - sourceNode.position.y / scaleFactor;
      const x2 = centerOffsetX - targetNode.position.x / scaleFactor;
      const y2 = centerOffsetY - targetNode.position.y / scaleFactor;

      // 计算线条长度和角度
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

      return (
        <View
          key={`${line.sourceId}-${line.targetId}`}
          style={{
            position: "absolute",
            left: x1,
            top: y1,
            width: length,
            height: 1,
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: `${angle}deg` },
              { translateX: 0 },
              { translateY: 0 },
            ],
          }}
        >
          <DestinyLine line={line} isActive={line.requiredLevel <= level} />
        </View>
      );
    });
  };

  // 渲染成长动画效果
  const renderGrowthAnimation = () => {
    if (!animatingNode) return null;

    const node = data.nodes.find((n) => n.id === animatingNode);
    if (!node) return null;

    // 计算中心偏移，并反转坐标系方向，使用更合适的偏移量和缩放比例
    const centerOffsetX = 100; // 保持偏移量
    const centerOffsetY = 100; // 保持偏移量
    const scaleFactor = 1.0; // 进一步减小缩放因子，使节点分布更开

    return (
      <Animated.View
        style={[
          styles.growthAnimation,
          {
            left: centerOffsetX - node.position.x / scaleFactor - 30,
            top: centerOffsetY - node.position.y / scaleFactor - 30,
            width: 60,
            height: 60,
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [0.5, 2],
              outputRange: [1, 0],
            }),
          },
        ]}
      />
    );
  };

  // 添加到渲染部分
  const renderStars = () => {
    return stars.map((star) => (
      <Animated.View
        key={star.id}
        style={{
          position: "absolute",
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: "#FFFFFF",
          left: star.left,
          top: star.top,
          opacity: star.opacity,
        }}
      />
    ));
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartVisualization}>
        {/* 星空背景效果 */}
        <View style={styles.chartBackground}>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <View style={styles.backgroundPattern}></View>
          <View style={styles.backgroundGlow}></View>
        </View>

        {/* 命运线连接 */}
        {renderLines()}

        {/* 图谱节点 */}
        {renderNodes()}

        {/* 成长动画效果 */}
        {renderGrowthAnimation()}
      </View>

      {/* 能量和等级指示器 */}
      <View style={styles.infoContainer}>
        <View style={styles.energyIndicator}>
          <Text style={styles.indicatorLabel}>能量</Text>
          <View style={styles.energyBarContainer}>
            <View
              style={[styles.energyBar, { width: `${Math.min(100, energy)}%` }]}
            />
          </View>
          <Text style={styles.energyValue}>{energy}/100</Text>
        </View>

        <View style={styles.levelContainer}>
          <Text style={styles.levelLabel}>等级</Text>
          <Text style={styles.levelValue}>{level}</Text>
        </View>
      </View>

      {/* 图例说明 */}
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={styles.legendDotActive}></View>
          <Text style={styles.legendText}>已激活</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDotUnlocked}></View>
          <Text style={styles.legendText}>已解锁</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDotLocked}></View>
          <Text style={styles.legendText}>未解锁</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 450,
    alignSelf: "center",
    marginVertical: 10,
  },
  chartVisualization: {
    width: "100%",
    height: "82%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: CHART_COLORS.background,
    borderWidth: 1,
    borderColor: "rgba(229, 193, 88, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  chartBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  backgroundPattern: {
    width: "85%",
    height: "85%",
    borderRadius: 300,
    borderWidth: 1,
    borderColor: CHART_COLORS.backgroundPattern,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundGlow: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: 200,
    backgroundColor: "rgba(229, 193, 88, 0.03)",
    shadowColor: "#E5C158",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  energyIndicator: {
    flex: 3,
    marginRight: 15,
  },
  indicatorLabel: {
    fontSize: 14,
    color: "#F9E07F",
    fontWeight: "bold",
    marginBottom: 5,
  },
  energyBarContainer: {
    height: 8,
    backgroundColor: "rgba(26, 10, 51, 0.6)",
    borderRadius: 4,
    overflow: "hidden",
  },
  energyBar: {
    height: "100%",
    backgroundColor: "#E5C158",
    borderRadius: 4,
  },
  energyValue: {
    fontSize: 12,
    color: "#FFF8E1",
    marginTop: 5,
    textAlign: "right",
  },
  levelContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(26, 10, 51, 0.6)",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(229, 193, 88, 0.3)",
  },
  levelLabel: {
    fontSize: 12,
    color: "#F9E07F",
    fontWeight: "bold",
  },
  levelValue: {
    fontSize: 18,
    color: "#FFF8E1",
    fontWeight: "bold",
  },
  nodeWrapper: {
    position: "absolute",
    width: 70,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  node: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  nodeInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  nodeActive: {
    backgroundColor: CHART_COLORS.activeNode,
    borderWidth: 2,
    borderColor: "#FFF8E1",
    shadowColor: CHART_COLORS.activeNode,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  nodeUnlocked: {
    backgroundColor: CHART_COLORS.unlockedNode,
    borderWidth: 1,
    borderColor: CHART_COLORS.unlockedBorder,
  },
  nodeLocked: {
    backgroundColor: CHART_COLORS.lockedNode,
    borderWidth: 1,
    borderColor: CHART_COLORS.lockedBorder,
    opacity: 0.8,
  },
  nodeIcon: {
    width: 22,
    height: 22,
    tintColor: CHART_COLORS.nodeText,
    opacity: 1,
    backgroundColor: "transparent",
    resizeMode: "contain",
  },
  nodeEnergyText: {
    fontSize: 13,
    fontWeight: "bold",
    color: CHART_COLORS.nodeText,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nodeEnergyTextLocked: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  nodeLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "bold",
    color: CHART_COLORS.nodeLabelActive,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  nodeLabelLocked: {
    color: CHART_COLORS.nodeLabelLocked,
  },
  growthAnimation: {
    position: "absolute",
    borderRadius: 60,
    backgroundColor: "rgba(229, 193, 88, 0.2)",
    borderWidth: 2,
    borderColor: "#E5C158",
    shadowColor: "#E5C158",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    height: "8%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CHART_COLORS.activeNode,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#FFF8E1",
  },
  legendDotUnlocked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CHART_COLORS.unlockedNode,
    marginRight: 6,
    borderWidth: 1,
    borderColor: CHART_COLORS.unlockedBorder,
  },
  legendDotLocked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CHART_COLORS.lockedNode,
    marginRight: 6,
    borderWidth: 1,
    borderColor: CHART_COLORS.lockedBorder,
    opacity: 0.8,
  },
  legendText: {
    fontSize: 12,
    color: "#FFF8E1",
    letterSpacing: 0.5,
  },
});
