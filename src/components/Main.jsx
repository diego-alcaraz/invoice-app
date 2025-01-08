import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// import Main from './src/components/Main.jsx';
import UserTable  from './TableComponent';
import WorkingHoursCalculator from './InsertHoursComputeTotal';
import AppBar from './AppBar';
import HomeScreen from '../screens/HomeScreen';
import LogInPage from '../screens/LogIn';

const Stack = createStackNavigator();

// Example screens
const ProfileScreen = () => (
  <View style={styles.screen}>
    <LogInPage/>
  </View>
);

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
    <LogInPage/>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Profile" component={LogInPage} />
    //     <Stack.Screen name="Details" component={DetailsScreen} />
    //     <Stack.Screen name="Settings" component={SettingsScreen} />
    //   </Stack.Navigator>
    //   <AppBar />
    // </NavigationContainer>
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


// const Main = () => (
//   <NavigationContainer>
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ header: () => <AppBar /> }}
//       />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

// export default Main;