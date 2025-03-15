import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Partner } from '../../types/social';

interface RecommendedPartnersProps {
  partners: Partner[];
}

const RecommendedPartners: React.FC<RecommendedPartnersProps> = ({ partners }) => {
  if (!partners || partners.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无推荐伙伴</Text>
      </View>
    );
  }

  const renderPartnerItem = ({ item }: { item: Partner }) => (
    <TouchableOpacity key={item.id} style={styles.partnerCard}>
      <View style={styles.resonanceIndicator}>
        <Text style={styles.resonanceText}>{item.resonanceScore}%</Text>
        <Text style={styles.resonanceLabel}>共振</Text>
      </View>
      <Image source={{ uri: item.avatar }} style={styles.partnerAvatar} />
      <Text style={styles.partnerName}>{item.name}</Text>
      <Text style={styles.partnerTitle}>{item.title}</Text>
      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 2).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectButtonText}>联系</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={partners}
      renderItem={renderPartnerItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  partnerCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  resonanceIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4a6fa5',
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  resonanceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  resonanceLabel: {
    color: 'white',
    fontSize: 10,
  },
  partnerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: 'center',
    marginBottom: 10,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  partnerTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    margin: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#4a6fa5',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecommendedPartners;
