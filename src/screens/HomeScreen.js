import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions } from 'react-native';

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require('../icon/ColdBottle_bg.jpg')} // Path to your logo image
      style={styles.background}
      resizeMode="cover" // Ensures the image covers the entire screen
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to InvoiceApp</Text>
        <Text style={styles.description}>
          Easily track your daily work hours and generate weekly summaries with GPS support.
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default HomeScreen;