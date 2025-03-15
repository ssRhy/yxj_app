import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Activity } from '../../types/social';

interface PopularActivitiesProps {
  activities: Activity[];
}

const PopularActivities: React.FC<PopularActivitiesProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无热门活动</Text>
      </View>
    );
  }

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity key={item.id} style={styles.activityCard}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.metaItem}>
            <Image 
              source={require('../../assets/icons/calendar.png')} 
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Image 
              source={require('../../assets/icons/location.png')} 
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.participantsContainer}>
          <View style={styles.avatarsRow}>
            {item.participants.slice(0, 3).map((participant, index) => (
              <Image 
                key={index} 
                source={{ uri: participant.avatar }} 
                style={[
                  styles.participantAvatar,
                  { marginLeft: index > 0 ? -10 : 0 }
                ]}
              />
            ))}
            {item.participants.length > 3 && (
              <View style={styles.moreParticipants}>
                <Text style={styles.moreParticipantsText}>
                  +{item.participants.length - 3}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.participantsText}>
            {item.participants.length} 人参与
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={activities}
      renderItem={renderActivityItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  activityImage: {
    width: 100,
    height: 100,
  },
  activityInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityMeta: {
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
    opacity: 0.7,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  participantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
  moreParticipants: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreParticipantsText: {
    fontSize: 10,
    color: '#666',
  },
  participantsText: {
    fontSize: 12,
    color: '#666',
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

export default PopularActivities;
