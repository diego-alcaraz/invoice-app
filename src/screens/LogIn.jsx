import React from 'react';
import { Formik } from 'formik';
import { Button, StyleSheet, View } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';


const initialValues = {
    email: '',
    password: '',
}



export default function LogInPage() {
    return (
        <Formik
          initialValues={initialValues}
          onSubmit={values => console.log(values)}
        >
          {({ handleChange, handleSubmit, values }) => {
          return (
            <View>
              <StyledTextInput
                placeholder="E-mail"
                value={values.email}
                onChangeText={handleChange('email')}
              />
    
              <StyledTextInput
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
              />
    
              <Button title="Log In" onPress={handleSubmit} />
            </View>
          )}}
        </Formik>
      );
    }