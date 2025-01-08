import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const AppBarTab = ({ active, icon, to }) => {
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

  return (
    <Appbar.Action
      icon={icon} // Pass valid icon name
      onPress={() => navigation.navigate(to)} // Navigate to the passed screen
    />
  );
};

const AppBar = () => (
  <Appbar style={styles.bottom}>
    <Appbar.Action
      icon={() => (
        <Image source={require('../icon/LogoM.jpg')} style={styles.image} />
      )}
      onPress={() => navigation.navigate('Home')}
    />
    <AppBarTab active={true} to="Profile" icon="account" />
    <AppBarTab to="Details" icon="view-list-outline" />
    <AppBarTab to="Settings" icon="cog-outline" />
  </Appbar>
);

export default AppBar;

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2f2c33',
  },

  image: {
    width: 25,
    height: 25,
    borderRadius: 20, // Makes it circular
  },
});
