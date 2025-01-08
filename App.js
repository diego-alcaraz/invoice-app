import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Main from './src/components/Main';

const App = () => {
  return (
    <Main />
  );
};


export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});