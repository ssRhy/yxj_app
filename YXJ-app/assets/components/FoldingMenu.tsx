// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 定义组件的属性类型
interface FoldingMenuProps {
  onCategorySelect: (category: string, subcategory?: string, childCategory?: string) => void;
}

// 定义菜单数据结构
interface MenuItem {
  id: string;
  title: string;
  subcategories?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  title: string;
  children?: ChildMenuItem[];
}

interface ChildMenuItem {
  id: string;
  title: string;
}

const FoldingMenu = ({ onCategorySelect }: FoldingMenuProps) => {
  // 示例菜单数据
  const menuItems: MenuItem[] = [
    {
      id: 'career',
      title: '职业发展',
      subcategories: [
        {
          id: 'job-change',
          title: '工作变动',
          children: [
            { id: 'new-job', title: '新工作机会' },
            { id: 'promotion', title: '晋升机会' },
            { id: 'resignation', title: '离职决策' }
          ]
        },
        {
          id: 'skill-dev',
          title: '技能发展',
          children: [
            { id: 'learn-tech', title: '学习新技术' },
            { id: 'certification', title: '考取证书' },
            { id: 'training', title: '参加培训' }
          ]
        }
      ]
    },
    {
      id: 'finance',
      title: '财务决策',
      subcategories: [
        {
          id: 'investment',
          title: '投资选择',
          children: [
            { id: 'stocks', title: '股票投资' },
            { id: 'real-estate', title: '房产投资' },
            { id: 'funds', title: '基金投资' }
          ]
        },
        {
          id: 'expense',
          title: '支出规划',
          children: [
            { id: 'large-purchase', title: '大额购买' },
            { id: 'budget', title: '预算调整' },
            { id: 'saving', title: '储蓄计划' }
          ]
        }
      ]
    },
    {
      id: 'life',
      title: '生活选择',
      subcategories: [
        {
          id: 'relocation',
          title: '搬迁决策',
          children: [
            { id: 'city-change', title: '城市变更' },
            { id: 'house-change', title: '住所变更' }
          ]
        },
        {
          id: 'relationship',
          title: '人际关系',
          children: [
            { id: 'dating', title: '交友决策' },
            { id: 'family', title: '家庭决策' }
          ]
        }
      ]
    }
  ];

  // 状态管理
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  // 处理类别展开/折叠
  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // 折叠当前展开的类别
      setExpandedCategory(null);
      setExpandedSubcategory(null);
    } else {
      // 展开选中的类别
      setExpandedCategory(categoryId);
    }
  };

  // 处理子类别展开/折叠
  const toggleSubcategory = (subcategoryId: string) => {
    if (expandedSubcategory === subcategoryId) {
      // 折叠当前展开的子类别
      setExpandedSubcategory(null);
    } else {
      // 展开选中的子类别
      setExpandedSubcategory(subcategoryId);
    }
  };

  // 处理选择
  const handleSelect = (category: MenuItem, subcategory?: SubMenuItem, childItem?: ChildMenuItem) => {
    if (childItem) {
      onCategorySelect(category.title, subcategory?.title, childItem.title);
    } else if (subcategory) {
      onCategorySelect(category.title, subcategory.title);
    } else {
      onCategorySelect(category.title);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>决策类型</Text>
      
      {menuItems.map((category) => {
        return (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={{ transform: [{ rotate: expandedCategory === category.id ? '90deg' : '0deg' }] }}>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </View>
            </TouchableOpacity>

            {expandedCategory === category.id && category.subcategories && (
              <View style={styles.subcategoriesContainer}>
                {category.subcategories.map((subcategory) => {
                  return (
                    <View key={subcategory.id} style={styles.subcategoryContainer}>
                      <TouchableOpacity
                        style={styles.subcategoryHeader}
                        onPress={() => toggleSubcategory(subcategory.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.subcategoryTitle}>{subcategory.title}</Text>
                        <View style={{ transform: [{ rotate: expandedSubcategory === subcategory.id ? '90deg' : '0deg' }] }}>
                          <Ionicons name="chevron-forward" size={18} color="#777" />
                        </View>
                      </TouchableOpacity>

                      {expandedSubcategory === subcategory.id && subcategory.children && (
                        <View style={styles.childrenContainer}>
                          {subcategory.children.map((childItem) => (
                            <TouchableOpacity
                              key={childItem.id}
                              style={styles.childItem}
                              onPress={() => handleSelect(category, subcategory, childItem)}
                              activeOpacity={0.6}
                            >
                              <Text style={styles.childItemText}>{childItem.title}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  subcategoriesContainer: {
    paddingLeft: 15,
    marginTop: 5,
  },
  subcategoryContainer: {
    marginBottom: 5,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  subcategoryTitle: {
    fontSize: 14,
    color: '#444',
  },
  childrenContainer: {
    paddingLeft: 15,
    marginTop: 5,
  },
  childItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 2,
    backgroundColor: '#fff',
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    borderRadius: 4,
  },
  childItemText: {
    fontSize: 13,
    color: '#555',
  },
});

export default FoldingMenu;