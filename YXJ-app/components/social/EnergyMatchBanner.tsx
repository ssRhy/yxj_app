import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface EnergyMatchBannerProps {
  onTestPress: () => void;
}

const EnergyMatchBanner: React.FC<EnergyMatchBannerProps> = ({ onTestPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bannerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>发现您的能量共振伙伴</Text>
          <Text style={styles.description}>
            完成决策风格测试，找到与您决策模式相似的共业伙伴
          </Text>
          <TouchableOpacity style={styles.button} onPress={onTestPress}>
            <Text style={styles.buttonText}>开始测试</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={require('../../assets/images/energy-match.png')} 
          style={styles.bannerImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 15,
    backgroundColor: '#4a6fa5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerContent: {
    flexDirection: 'row',
    padding: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
    lineHeight: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#4a6fa5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default EnergyMatchBanner;
