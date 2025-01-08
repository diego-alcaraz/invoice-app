import React from "react";
import { TextInput, StyleSheet } from "react-native";


const styles = StyleSheet.create({ 
    
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        BorderRadiuses: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

 }) ;

 const StyledTextInput = ({ style= {}, ...props }) => {
    const inputStyle = {
            ...styles.textInput, 
            ...style
        };
    return <TextInput style={inputStyle} {...props} />
   }
 
 
