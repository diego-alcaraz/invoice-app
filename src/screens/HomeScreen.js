import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, StatusBar, SafeAreaView } from 'react-native';


const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>  
      <ImageBackground
        source={require('../icon/ColdBottle_bg.jpg')} 
        style={styles.background }
        resizeMode="cover" 
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to InvoiceApp</Text>
          <Text style={styles.description}>
            Easily track your daily work hours and generate weekly summaries with GPS support.
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:  Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    backgroundColor: 'rgba(171, 171, 171, 0.75)',
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