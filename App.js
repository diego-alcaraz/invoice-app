import React from 'react';
import { StyleSheet, View, Text,Dimensions,StatusBar, FlatListComponent, ViewBase } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from './src/components/AppBar';
import HomeScreen from './src/screens/HomeScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';

import LoginScreen from './src/components/Login';




const Tab = createBottomTabNavigator();

// Example screen components - replace these with your actual screens
const Home = () => (
  <View style={{...styles.container, backgroundColor: 'lighgray'}}>
    <HomeScreen/>
  </View>
);

const ProfileScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <LoginScreen/>
    </View>
  </SafeAreaView>
);

const DetailsScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <View>
        <InvoiceScreen/>
    </View>
  </SafeAreaView>
);

const SettingsScreen = () => (
  <SafeAreaView style={styles.safeArea}> 
    <View style={{flex:1, backgroundColor: 'gray'}}>

      <View style={{...styles.container, backgroundColor: 'orange'}}>
        <Text> Setting Screen 1 Top</Text>
      </View>

      <View style={{flex:1, flexDirection: 'row'}}>
        <View style={{...styles.container, flex:2, backgroundColor:'lightblue'}}>
          <Text> Setting Screen 1 Bottom</Text>
        </View>
        <View style={{...styles.container, flex:1, backgroundColor: 'lightgreen'}}>
          <Text> Setting Screen 2 Bottom</Text>
        </View>
      </View>

    </View>
  </SafeAreaView>
);

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Tab.Navigator
          tabBar={props => <AppBar {...props} />}
          screenOptions={{
            headerShown: false // This hides the default header
          }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Details" component={DetailsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding:10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  centrar : {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  },
});