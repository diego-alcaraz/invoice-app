import { StyleSheet, Text, View } from 'react-native';
import Main from './src/components/Main.jsx';
import UserTable  from './src/components/TableComponent.jsx';
import WorkingHoursCalculator from './src/components/InsertHoursComputeTotal.jsx';
import AppBar from './src/components/AppBar.jsx';
import HomeScreen from './src/screens/HomeScreen.js';

export default function App() {
  return (
    <>
      <HomeScreen />
      <AppBar />
    </>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
