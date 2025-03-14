// 根据出生日期计算星座
export const calculateZodiacSign = (birthDate: string): string => {
  if (!birthDate) return "";

  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // 月份从0开始
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "双鱼座";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "白羊座";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "金牛座";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "双子座";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "巨蟹座";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "狮子座";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "处女座";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "天秤座";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "天蝎座";
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "射手座";
  } else {
    return "摩羯座";
  }
};

// 获取所有MBTI类型
export const getAllMBTITypes = (): string[] => {
  return [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];
};

// 获取MBTI类型描述
export const getMBTIDescription = (mbtiType: string): string => {
  const descriptions: Record<string, string> = {
    INTJ: "建筑师 - 具有想象力和战略性的思想家，有着宏大的计划。",
    INTP: "逻辑学家 - 具有创造力的发明家，对知识有着不可抑制的渴望。",
    ENTJ: "指挥官 - 大胆、富有想象力且意志坚强的领导者，总能找到或创造解决方案。",
    ENTP: "辩论家 - 聪明好奇的思想家，不会放过任何智力上的挑战。",
    INFJ: "提倡者 - 安静而神秘，但非常有启发性和鼓舞人心的理想主义者。",
    INFP: "调停者 - 诗意、善良的利他主义者，总是热切地为善事提供帮助。",
    ENFJ: "主角 - 富有魅力和鼓舞人心的领导者，能够吸引听众。",
    ENFP: "竞选者 - 热情、有创造力和社交能力的自由精神，总能找到理由微笑。",
    ISTJ: "物流师 - 实际和注重事实的个人，其可靠性是无可争议的。",
    ISFJ: "守卫者 - 非常专注和温暖的保护者，随时准备保护他们所爱的人。",
    ESTJ: "总经理 - 出色的管理者，对细节有不可思议的关注能力。",
    ESFJ: "执政官 - 极其关心的、社会性的、受欢迎的，总是热衷于帮助。",
    ISTP: "鉴赏家 - 大胆和实际的实验者，精通各种工具。",
    ISFP: "探险家 - 灵活和有魅力的艺术家，随时准备探索和体验新事物。",
    ESTP: "企业家 - 聪明、精力充沛、善于感知的人，真正享受生活。",
    ESFP: "表演者 - 自发的、精力充沛和热情的娱乐者。",
  };

  return descriptions[mbtiType] || "未知MBTI类型";
};

// 简单的八字计算（仅作示例，实际八字计算需要更复杂的算法）
export const calculateSimpleBaZi = (birthDate: string): string => {
  if (!birthDate) return "";

  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // 这里只是一个非常简化的示例，实际八字计算需要农历和天干地支转换
  const yearElement = getSimpleElement(year % 10);
  const monthElement = getSimpleElement(month % 10);
  const dayElement = getSimpleElement(day % 10);
  const hourElement = getSimpleElement(hour % 10);

  return `${yearElement}年 ${monthElement}月 ${dayElement}日 ${hourElement}时`;
};

// 简单的五行属性（仅作示例）
const getSimpleElement = (num: number): string => {
  const elements = ["金", "木", "水", "火", "土"];
  return elements[num % 5];
};

// 星座计算
export const getZodiacSign = (month: number, day: number): string => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "双鱼座";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "白羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "金牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "双子座";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "巨蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "狮子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "处女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
    return "天秤座";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 21))
    return "天蝎座";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "射手座";
  return "摩羯座";
};

// 计算八字（简化版）
export const calculateChineseFortune = (birthDate: Date): string => {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // 简化的天干地支计算
  const heavenlyStem = [
    "甲",
    "乙",
    "丙",
    "丁",
    "戊",
    "己",
    "庚",
    "辛",
    "壬",
    "癸",
  ];
  const earthlyBranch = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];

  // 计算年柱（简化）
  const yearIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;

  // 简化的月柱和日柱计算
  const monthStem = (month + 2) % 10;
  const monthBranch = month % 12;

  const dayStem = (day + 6) % 10;
  const dayBranch = day % 12;

  return `${heavenlyStem[yearIndex]}${earthlyBranch[yearBranchIndex]} ${heavenlyStem[monthStem]}${earthlyBranch[monthBranch]} ${heavenlyStem[dayStem]}${earthlyBranch[dayBranch]}`;
};

// MBTI类型列表
export const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];
