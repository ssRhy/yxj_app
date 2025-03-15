import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Tag {
  id: string;
  name: string;
}

interface FilterTagsProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ tags, selectedTags, onTagToggle }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map(tag => (
        <TouchableOpacity
          key={tag.id}
          style={[
            styles.tag,
            selectedTags.includes(tag.id) && styles.selectedTag
          ]}
          onPress={() => onTagToggle(tag.id)}
        >
          <Text 
            style={[
              styles.tagText,
              selectedTags.includes(tag.id) && styles.selectedTagText
            ]}
          >
            {tag.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedTag: {
    backgroundColor: '#e6eef7',
    borderColor: '#4a6fa5',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTagText: {
    color: '#4a6fa5',
    fontWeight: '500',
  },
});

export default FilterTags;
