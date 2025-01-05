import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Use navigation hook

const AppBarTab = ({ active, children, to }) => {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <Appbar.Action
      icon={children}
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
      onPress={() => console.log('Image pressed')}
    />
    <AppBarTab active={true} to="Profile">
      {"account"}
    </AppBarTab>
    <AppBarTab to="Details">
      {"view-list-outline"}
    </AppBarTab>
    <AppBarTab to="Settings">
      {"strategy"}
    </AppBarTab>
  </Appbar>
);

export default AppBar;

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  image: {
    width: 25,
    height: 25,
    borderRadius: 20, // Makes it circular
  },
});