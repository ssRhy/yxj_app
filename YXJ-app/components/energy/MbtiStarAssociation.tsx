import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useUser } from "../../context/UserContext";

// MBTI类型定义
interface MbtiType {
  type: string;
  name: string;
  description: string;
  stars: {
    name: string;
    association: string;
  }[];
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

// 星曜关联数据
const mbtiData: MbtiType[] = [
  {
    type: "INTJ",
    name: "建筑师",
    description: "具有战略思维的创新者，有远见卓识的规划者",
    stars: [
      {
        name: "紫微星",
        association:
          "紫微星的领导气质与INTJ的战略思维相辅相成，使其在规划和执行方面更具权威性。",
      },
      {
        name: "天机星",
        association:
          "天机星的智慧与INTJ的分析能力相结合，增强了其洞察力和创新思维。",
      },
    ],
    traits: ["独立", "理性", "有远见", "决断力强", "追求完美"],
    strengths: ["战略规划", "系统思考", "独立解决问题", "高效执行"],
    weaknesses: ["可能显得冷漠", "过于完美主义", "不善于表达情感"],
    careers: ["战略规划师", "科学家", "系统分析师", "工程师", "企业家"],
  },
  {
    type: "INFJ",
    name: "提倡者",
    description: "安静而神秘的理想主义者，充满激励和创造力",
    stars: [
      {
        name: "天同星",
        association:
          "天同星的仁慈特质与INFJ的理想主义相结合，增强了其同理心和人道主义倾向。",
      },
      {
        name: "太阴星",
        association:
          "太阴星的直觉与INFJ的洞察力相辅相成，使其更能理解他人的情感需求。",
      },
    ],
    traits: ["有洞察力", "理想主义", "有创造力", "有同理心", "坚定"],
    strengths: [
      "深刻的洞察力",
      "创造性解决问题",
      "强烈的价值观",
      "关注他人福祉",
    ],
    weaknesses: ["过于理想化", "容易精疲力竭", "对批评敏感"],
    careers: ["咨询师", "心理治疗师", "作家", "教师", "社会工作者"],
  },
  {
    type: "INTP",
    name: "逻辑学家",
    description: "具有创新思维的发明家，渴望知识和理解",
    stars: [
      {
        name: "巨门星",
        association:
          "巨门星的思辨特质与INTP的逻辑思维相结合，增强了其分析能力和批判性思考。",
      },
      {
        name: "天机星",
        association:
          "天机星的智慧与INTP的创新思维相辅相成，使其在理论构建和概念化方面更为出色。",
      },
    ],
    traits: ["逻辑思考", "好奇心强", "理论导向", "独立", "创新"],
    strengths: ["概念性思考", "解决复杂问题", "创新能力", "客观分析"],
    weaknesses: ["可能忽视实际细节", "社交互动困难", "拖延"],
    careers: ["科学家", "程序员", "系统分析师", "哲学家", "研究员"],
  },
  {
    type: "INFP",
    name: "调停者",
    description: "诗意的理想主义者，总是愿意为他人提供帮助",
    stars: [
      {
        name: "天相星",
        association:
          "天相星的善良特质与INFP的理想主义相结合，增强了其对和谐与美好的追求。",
      },
      {
        name: "太阴星",
        association:
          "太阴星的情感敏感性与INFP的同理心相辅相成，使其更能理解和表达深层情感。",
      },
    ],
    traits: ["理想主义", "富有同情心", "创造力强", "忠诚", "适应性强"],
    strengths: ["深刻的价值观", "创造性表达", "理解他人", "灵活应对变化"],
    weaknesses: ["过于敏感", "不切实际", "避免冲突"],
    careers: ["作家", "艺术家", "心理咨询师", "教师", "社会活动家"],
  },
  {
    type: "ENTJ",
    name: "指挥官",
    description: "大胆、富有想象力的领导者，总是找到方法实现目标",
    stars: [
      {
        name: "紫微星",
        association:
          "紫微星的领导气质与ENTJ的指挥能力相结合，使其在组织和管理方面更具权威性。",
      },
      {
        name: "七杀星",
        association:
          "七杀星的决断力与ENTJ的果断特质相辅相成，增强了其在面对挑战时的魄力。",
      },
    ],
    traits: ["果断", "有领导力", "战略性思考", "自信", "高效"],
    strengths: ["组织能力", "长期规划", "决策能力", "推动变革"],
    weaknesses: ["可能过于专断", "不够耐心", "忽视情感因素"],
    careers: ["企业高管", "管理顾问", "企业家", "政治家", "项目经理"],
  },
  {
    type: "ENFJ",
    name: "主人公",
    description: "富有魅力和激情的领导者，能够激励他人",
    stars: [
      {
        name: "太阳星",
        association:
          "太阳星的光明特质与ENFJ的魅力相结合，增强了其激励他人和传播正能量的能力。",
      },
      {
        name: "天同星",
        association:
          "天同星的仁慈特质与ENFJ的关怀精神相辅相成，使其在人际关系中更具感染力。",
      },
    ],
    traits: ["富有魅力", "有同理心", "有说服力", "利他主义", "有责任感"],
    strengths: ["人际交往", "激励他人", "组织活动", "解决冲突"],
    weaknesses: ["过度理想化", "过于关注他人需求", "回避负面反馈"],
    careers: ["教师", "人力资源专家", "公关顾问", "政治家", "非营利组织领导"],
  },
  {
    type: "ENTP",
    name: "辩论家",
    description: "聪明好奇的思想家，不能抗拒智力挑战",
    stars: [
      {
        name: "巨门星",
        association:
          "巨门星的口才与ENTP的辩论能力相结合，增强了其在思想交流和辩论中的表现。",
      },
      {
        name: "贪狼星",
        association:
          "贪狼星的进取心与ENTP的好奇心相辅相成，使其不断追求新知识和挑战。",
      },
    ],
    traits: ["创新", "机智", "好辩", "适应性强", "好奇心强"],
    strengths: ["创造性思考", "辩论技巧", "快速学习", "解决复杂问题"],
    weaknesses: ["可能争论不休", "注意力不集中", "不喜欢常规"],
    careers: ["企业家", "律师", "咨询顾问", "创意总监", "发明家"],
  },
  {
    type: "ENFP",
    name: "活动家",
    description: "热情洋溢的创新者，总是看到新的可能性",
    stars: [
      {
        name: "太阳星",
        association:
          "太阳星的活力与ENFP的热情相结合，增强了其感染力和积极向上的特质。",
      },
      {
        name: "天机星",
        association:
          "天机星的创新思维与ENFP的想象力相辅相成，使其在创意和可能性探索方面更为出色。",
      },
    ],
    traits: ["热情", "创造力强", "社交能力强", "适应性强", "乐观"],
    strengths: ["人际交往", "创新思维", "激励他人", "发现可能性"],
    weaknesses: ["注意力不集中", "不切实际", "难以坚持长期计划"],
    careers: ["创意顾问", "营销专家", "演员", "教师", "企业家"],
  },
  {
    type: "ISTJ",
    name: "物流师",
    description: "实际而注重事实的个体，可靠性无可挑剔",
    stars: [
      {
        name: "武曲星",
        association:
          "武曲星的计划性与ISTJ的组织能力相结合，增强了其在细节管理和执行方面的表现。",
      },
      {
        name: "天梁星",
        association:
          "天梁星的责任感与ISTJ的可靠特质相辅相成，使其在履行职责时更加尽职尽责。",
      },
    ],
    traits: ["可靠", "实际", "有条理", "尽职尽责", "传统"],
    strengths: ["组织能力", "注重细节", "坚持不懈", "实际解决问题"],
    weaknesses: ["可能过于僵化", "抗拒变化", "可能忽视情感因素"],
    careers: ["会计师", "项目经理", "军事人员", "法官", "行政管理人员"],
  },
  {
    type: "ISFJ",
    name: "守卫者",
    description: "非常专注和温暖的保护者，总是准备保护他们关心的人",
    stars: [
      {
        name: "天梁星",
        association:
          "天梁星的忠诚特质与ISFJ的保护精神相结合，增强了其对家人和朋友的守护意识。",
      },
      {
        name: "天府星",
        association:
          "天府星的稳定特质与ISFJ的可靠性相辅相成，使其在提供支持和安全感方面更为出色。",
      },
    ],
    traits: ["忠诚", "有同情心", "有责任感", "注重细节", "有耐心"],
    strengths: ["关心他人", "实际支持", "记忆力强", "组织能力"],
    weaknesses: ["难以拒绝他人", "过度承担责任", "抗拒变化"],
    careers: ["护士", "行政助理", "社会工作者", "教师", "客户服务代表"],
  },
  {
    type: "ISTP",
    name: "鉴赏家",
    description: "大胆而实际的实验者，擅长使用各种工具",
    stars: [
      {
        name: "七杀星",
        association:
          "七杀星的行动力与ISTP的实践能力相结合，增强了其在解决实际问题时的效率。",
      },
      {
        name: "武曲星",
        association:
          "武曲星的精确性与ISTP的技术技能相辅相成，使其在操作和制作方面更为精准。",
      },
    ],
    traits: ["灵活", "实际", "独立", "冒险精神", "解决问题能力强"],
    strengths: ["技术技能", "危机处理", "实际解决问题", "适应变化"],
    weaknesses: ["可能冲动", "难以长期承诺", "可能显得冷漠"],
    careers: ["工程师", "机械师", "飞行员", "法医调查员", "运动员"],
  },
  {
    type: "ISFP",
    name: "探险家",
    description: "灵活而有魅力的艺术家，总是准备探索和体验新事物",
    stars: [
      {
        name: "太阴星",
        association:
          "太阴星的艺术感与ISFP的审美能力相结合，增强了其在艺术创作和表达方面的天赋。",
      },
      {
        name: "天相星",
        association:
          "天相星的和谐特质与ISFP的平和性格相辅相成，使其在创造美和享受当下方面更为出色。",
      },
    ],
    traits: ["艺术气质", "敏感", "和平主义", "灵活", "忠诚"],
    strengths: ["审美能力", "实际创造力", "关注当下", "和平解决冲突"],
    weaknesses: ["避免冲突", "过度谦虚", "难以长期规划"],
    careers: ["艺术家", "设计师", "音乐家", "厨师", "自然保护工作者"],
  },
  {
    type: "ESTJ",
    name: "总经理",
    description: "出色的管理者，对细节有不可思议的关注",
    stars: [
      {
        name: "武曲星",
        association:
          "武曲星的组织能力与ESTJ的管理技能相结合，增强了其在规划和执行方面的效率。",
      },
      {
        name: "七杀星",
        association:
          "七杀星的决断力与ESTJ的果断特质相辅相成，使其在领导和决策方面更为坚定。",
      },
    ],
    traits: ["有组织能力", "实际", "直接", "有责任感", "传统"],
    strengths: ["领导能力", "项目管理", "实施规则和程序", "解决实际问题"],
    weaknesses: ["可能过于武断", "不够灵活", "对情感不敏感"],
    careers: [
      "企业经理",
      "军事或警察领导",
      "项目经理",
      "金融分析师",
      "政府官员",
    ],
  },
  {
    type: "ESFJ",
    name: "执政官",
    description: "极其关心他人的、社交能力强的、受欢迎的人，总是热心帮助他人",
    stars: [
      {
        name: "天同星",
        association:
          "天同星的仁慈特质与ESFJ的关怀精神相结合，增强了其在照顾他人和提供支持方面的能力。",
      },
      {
        name: "天府星",
        association:
          "天府星的和谐特质与ESFJ的社交能力相辅相成，使其在建立和维护人际关系方面更为出色。",
      },
    ],
    traits: ["友好", "有责任感", "合作", "实际", "重视传统"],
    strengths: ["人际交往", "组织社交活动", "提供实际支持", "维护和谐"],
    weaknesses: ["过度关注他人看法", "难以应对批评", "可能忽视自身需求"],
    careers: [
      "人力资源专家",
      "医疗保健工作者",
      "教师",
      "社会工作者",
      "客户服务经理",
    ],
  },
  {
    type: "ESTP",
    name: "企业家",
    description: "聪明、精力充沛、非常有洞察力的人，真正享受冒险的生活",
    stars: [
      {
        name: "贪狼星",
        association:
          "贪狼星的冒险精神与ESTP的行动导向相结合，增强了其在把握机会和冒险方面的勇气。",
      },
      {
        name: "七杀星",
        association:
          "七杀星的果断特质与ESTP的决断力相辅相成，使其在面对挑战和竞争时更为出色。",
      },
    ],
    traits: ["大胆", "理性", "直接", "社交能力强", "实用主义"],
    strengths: ["危机处理", "谈判技巧", "实际解决问题", "适应变化"],
    weaknesses: ["可能冲动", "厌倦常规", "可能忽视长期后果"],
    careers: ["企业家", "销售人员", "营销专家", "运动员", "紧急救援人员"],
  },
  {
    type: "ESFP",
    name: "表演者",
    description: "自发的、精力充沛的、热情的人，生活永远不会因他们而无聊",
    stars: [
      {
        name: "太阳星",
        association:
          "太阳星的活力与ESFP的热情相结合，增强了其在表演和社交场合中的魅力和感染力。",
      },
      {
        name: "贪狼星",
        association:
          "贪狼星的享乐特质与ESFP的生活态度相辅相成，使其在寻找乐趣和创造欢乐氛围方面更为出色。",
      },
    ],
    traits: ["热情", "友好", "自发", "乐观", "实际"],
    strengths: ["人际交往", "创造欢乐氛围", "实际解决问题", "适应当下"],
    weaknesses: ["可能冲动", "难以长期规划", "可能逃避困难情况"],
    careers: ["演员", "销售人员", "活动策划师", "旅游顾问", "公关专家"],
  },
];

// 根据MBTI类型获取对应的颜色
const getMbtiColor = (type: string) => {
  const firstLetter = type.charAt(0);
  const secondLetter = type.charAt(1);

  let baseColor = "";

  // 根据第一个字母确定基础色调
  if (firstLetter === "I") {
    baseColor = "#3498db"; // 蓝色系
  } else {
    baseColor = "#e74c3c"; // 红色系
  }

  // 根据第二个字母调整亮度
  if (secondLetter === "N") {
    baseColor = baseColor + "aa"; // 稍微透明一点
  } else {
    baseColor = baseColor + "dd"; // 更不透明
  }

  return baseColor;
};

const MbtiStarAssociation: React.FC = () => {
  const { user } = useUser();

  // 默认MBTI类型，如果用户没有设置
  const defaultMbtiType = "INFJ";

  // 从用户数据中获取MBTI类型，如果没有则使用默认值
  const userMbtiType = user?.mbti || defaultMbtiType;

  // 查找用户对应的MBTI数据
  const userMbtiData =
    mbtiData.find((mbti) => mbti.type === userMbtiType) ||
    mbtiData.find((mbti) => mbti.type === defaultMbtiType);

  if (!userMbtiData) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>无法找到您的MBTI类型数据</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsScroll}>
        <View
          style={[
            styles.mbtiHeader,
            { backgroundColor: `${getMbtiColor(userMbtiData.type)}33` },
          ]}
        >
          <Text style={styles.mbtiHeaderType}>{userMbtiData.type}</Text>
          <Text style={styles.mbtiHeaderName}>{userMbtiData.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>性格描述</Text>
        <Text style={styles.descriptionText}>{userMbtiData.description}</Text>

        <Text style={styles.sectionTitle}>星曜关联</Text>
        {userMbtiData.stars.map((star, index) => (
          <View key={index} style={styles.starItem}>
            <Text style={styles.starName}>{star.name}</Text>
            <Text style={styles.starAssociation}>{star.association}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>性格特质</Text>
        <View style={styles.traitContainer}>
          {userMbtiData.traits.map((trait, index) => (
            <View key={index} style={styles.traitBadge}>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>优势</Text>
        <View style={styles.listContainer}>
          {userMbtiData.strengths.map((strength, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemBullet}>•</Text>
              <Text style={styles.listItemText}>{strength}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>挑战</Text>
        <View style={styles.listContainer}>
          {userMbtiData.weaknesses.map((weakness, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemBullet}>•</Text>
              <Text style={styles.listItemText}>{weakness}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>适合职业</Text>
        <View style={styles.careerContainer}>
          {userMbtiData.careers.map((career, index) => (
            <View key={index} style={styles.careerBadge}>
              <Text style={styles.careerText}>{career}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  detailsScroll: {
    flex: 1,
  },
  mbtiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  mbtiHeaderType: {
    color: "#fded13",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  mbtiHeaderName: {
    color: "white",
    fontSize: 18,
  },
  sectionTitle: {
    color: "#fded13",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
  },
  descriptionText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  starItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  starName: {
    color: "#fded13",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  starAssociation: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  traitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  traitBadge: {
    backgroundColor: "rgba(253, 237, 19, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  traitText: {
    color: "#fded13",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  listItemBullet: {
    color: "#fded13",
    fontSize: 16,
    marginRight: 8,
    width: 10,
  },
  listItemText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  careerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  careerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: "rgba(253, 237, 19, 0.3)",
  },
  careerText: {
    color: "white",
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MbtiStarAssociation;
