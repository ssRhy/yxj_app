import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Partner } from '../../types/social';

interface PartnersListProps {
  partners: Partner[];
}

const PartnersList: React.FC<PartnersListProps> = ({ partners }) => {
  const renderPartnerItem = ({ item }: { item: Partner }) => (
    <TouchableOpacity style={styles.partnerCard}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.partnerAvatar} />
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{item.name}</Text>
          <Text style={styles.partnerTitle}>{item.title}</Text>
        </View>
        <View style={styles.resonanceContainer}>
          <Text style={styles.resonanceScore}>{item.resonanceScore}%</Text>
          <Text style={styles.resonanceLabel}>共振</Text>
        </View>
      </View>
      
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Image 
            source={require('../../assets/icons/message.png')} 
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>发消息</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>查看详情</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={partners}
      renderItem={renderPartnerItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  partnerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  partnerTitle: {
    fontSize: 14,
    color: '#666',
  },
  resonanceContainer: {
    backgroundColor: '#4a6fa5',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
  },
  resonanceScore: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resonanceLabel: {
    color: 'white',
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: 5,
  },
  actionIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  primaryButton: {
    backgroundColor: '#4a6fa5',
    borderColor: '#4a6fa5',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default PartnersList;
