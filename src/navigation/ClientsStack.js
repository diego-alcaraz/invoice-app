import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ClientsScreen from '../screens/ClientsScreen'
import ClientFormScreen from '../screens/ClientFormScreen'

const Stack = createStackNavigator()

export default function ClientsStack () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ClientsList' component={ClientsScreen} />
      <Stack.Screen name='ClientForm' component={ClientFormScreen} />
    </Stack.Navigator>
  )
}
