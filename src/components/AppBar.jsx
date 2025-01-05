import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";  

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#242424',
        padding: 8
    },

    text:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

const AppBar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.appBarText}>Home</Text>
        </View>
    )
}
