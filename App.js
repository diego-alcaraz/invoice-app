import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import AppBar from './src/components/AppBar';  // adjust path as needed
import Main from './src/components/Main';
import HomeScreen from './src/screens/HomeScreen';



const Tab = createBottomTabNavigator();

// Example screen components - replace these with your actual screens
const Home = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <HomeScreen/>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const DetailsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
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
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});