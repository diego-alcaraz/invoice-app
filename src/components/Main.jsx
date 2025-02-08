import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

import UserTable  from './TableComponent';
import WorkingHoursCalculator from './InsertHoursComputeTotal';
import AppBar from './AppBar';
import HomeScreen from '../screens/HomeScreen';


const Stack = createStackNavigator();


const DetailsScreen = () => (
  <View style={styles.screen}>
    <WorkingHoursCalculator/>
  </View>
);

const users = [
  { Date: '01/01/2025', Place: 'Alice St', KickOff: '6:00', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
  { Date: '02/01/2025', Place: 'Alice St', KickOff: '6:30', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
  { Date: '03/01/2025', Place: 'Alice St', KickOff: '7:00', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
  { Date: '04/01/2025', Place: 'Alice St', KickOff: '6:45', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
]; 

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text>Settings Screen</Text>
  </View>
);

const Main = () => {
  return (
    <AppBar/>

  );
};


export default Main;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

