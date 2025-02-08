import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Separate component for tab items
const AppBarTab = ({ active, icon, to }) => {
  const navigation = useNavigation();
  
  return (
    <Appbar.Action
      icon={icon}
      onPress={() => navigation.navigate(to)}
      color={active ? '#ffffff' : '#e0e0e0'} // Optional: different color for active tab
    />
  );
};

// Main AppBar component
const AppBar = () => {
  const navigation = useNavigation(); // Add navigation here for the logo press

  return (
    <Appbar style={styles.bottom}>
      <Appbar.Action
        icon={() => (
          <Image 
            source={require('../icon/LogoM.jpg')} 
            style={styles.image}
          />
        )}
        onPress={() => navigation.navigate('Home')}
      />
      <AppBarTab active={true} to="Profile" icon="account" />
      <AppBarTab to="Details" icon="view-list-outline" />
      <AppBarTab to="Settings" icon="cog-outline" />
    </Appbar>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'gray',
    elevation: 8, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
});

export default AppBar;