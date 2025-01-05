import {Text, View } from 'react-native'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppBar from './src/components/AppBar.jsx';
import HomeScreen from './src/screens/HomeScreen.js';


const Stack = createStackNavigator();

const Main = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => <AppBar /> }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Main;