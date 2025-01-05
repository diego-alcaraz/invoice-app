// import React from "react";
// import { View, StyleSheet } from "react-native";
// import Constants from "expo-constants";  

// const AppBar = () => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.appBarText}>Home</Text>
//         </View>
//     )
// }

import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';
import { Link } from 'react-router-native';

const AppBarTab = ({active, children, to}) => {
    return (
        <Link to={to}>
            <Appbar.Action icon={children} onPress={() => console.log('Pressed mail')} />
        </Link>
        )
    };

const AppBar = () => (
 <Appbar style={styles.bottom}>
    <Appbar.Action
        icon={() => (
          <Image source={require('../icon/LogoM.jpg')}  style={styles.image} />
        )}
        onPress={() => console.log('Image pressed')}
      />
    <Appbar.Action icon="account" onPress={() => console.log('Pressed mail')} />
    <Appbar.Action icon="view-list-outline" onPress={() => console.log('Pressed label')} />
    <Appbar.Action icon="strategy" onPress={() => console.log('Pressed delete')} />
  </Appbar>
 );

export default AppBar

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