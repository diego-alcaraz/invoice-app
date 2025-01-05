import { StyleSheet, Text, View } from 'react-native';
import Main from './src/components/Main.jsx';
import UserTable  from './src/components/TableComponent.jsx';
import WorkingHoursCalculator from './src/components/InsertHoursComputeTotal.jsx';
import AppBar from './src/components/AppBar.jsx';

// const users = [
//   { Date: '01/01/2025', Place: 'Alice St', KickOff: '6:00', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
//   { Date: '02/01/2025', Place: 'Alice St', KickOff: '6:30', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
//   { Date: '03/01/2025', Place: 'Alice St', KickOff: '7:00', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
//   { Date: '04/01/2025', Place: 'Alice St', KickOff: '6:45', ClockOut: '14:00', BreakHours: '1', TotaHours: '7' },
// ];

// <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 16 }}>
// Traiding Hours
// </Text>
// <UserTable users={users} />

export default function App() {
  return (
    <View style={styles.container}>
      <AppBar />
      <WorkingHoursCalculator />  
    </View>
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
