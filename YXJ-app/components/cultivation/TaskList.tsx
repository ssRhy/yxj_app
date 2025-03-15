import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  energyReward: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'achievement';
  deadline?: Date;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete }) => {
  // 按类型分组任务
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.type]) {
      acc[task.type] = [];
    }
    acc[task.type].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // 获取任务类型的中文名称
  const getTaskTypeName = (type: string): string => {
    const typeNames = {
      daily: '每日任务',
      weekly: '每周任务',
      achievement: '成就任务'
    };
    
    return typeNames[type as keyof typeof typeNames] || '其他任务';
  };
  
  // 计算截止日期
  const getDeadlineText = (deadline?: Date): string => {
    if (!deadline) return '';
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已过期';
    if (diffDays === 0) return '今天截止';
    if (diffDays === 1) return '明天截止';
    return `${diffDays}天后截止`;
  };
  
  // 处理任务完成
  const handleTaskComplete = (taskId: string) => {
    onTaskComplete(taskId);
  };
  
  return (
    <View style={styles.taskList}>
      <Text style={styles.title}>修行任务</Text>
      
      {Object.keys(groupedTasks).length === 0 ? (
        <View style={styles.emptyTasks}>
          <Text style={styles.emptyText}>暂无可用任务</Text>
        </View>
      ) : (
        <ScrollView>
          {Object.entries(groupedTasks).map(([type, typeTasks]) => (
            <View key={type} style={styles.taskGroup}>
              <Text style={styles.taskTypeTitle}>{getTaskTypeName(type)}</Text>
              
              <View style={styles.tasks}>
                {typeTasks.map(task => (
                  <View 
                    key={task.id} 
                    style={[styles.taskItem, task.completed && styles.completedTask]}
                  >
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskReward}>+{task.energyReward} 能量</Text>
                    </View>
                    
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    
                    <View style={styles.taskFooter}>
                      {task.deadline && (
                        <Text style={styles.taskDeadline}>{getDeadlineText(task.deadline)}</Text>
                      )}
                      
                      <TouchableOpacity 
                        style={[styles.taskCompleteBtn, task.completed ? styles.completedBtn : styles.activeBtn]}
                        onPress={() => !task.completed && handleTaskComplete(task.id)}
                        disabled={task.completed}
                        activeOpacity={task.completed ? 1 : 0.7}
                      >
                        <Text style={styles.btnText}>{task.completed ? '已完成' : '完成任务'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskList: {
    padding: 16,
    backgroundColor: '#aa96da',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyTasks: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: '#6b7280',
  },
  taskGroup: {
    marginBottom: 24,
  },
  taskTypeTitle: {
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: 4,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    color: '#374151',
  },
  tasks: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  completedTask: {
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskReward: {
    color: '#059669',
    fontWeight: 'bold',
  },
  taskDescription: {
    marginBottom: 12,
    color: '#4b5563',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDeadline: {
    color: '#ef4444',
    fontSize: 12,
  },
  taskCompleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  activeBtn: {
    backgroundColor: '#1d4ed8',
  },
  completedBtn: {
    backgroundColor: '#9ca3af',
  },
  btnText: {
    color: 'white',
    fontSize: 12,
  },
});
