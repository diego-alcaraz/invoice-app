import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import InvoiceListScreen from '../screens/InvoiceListScreen'
import InvoiceFormScreen from '../screens/InvoiceFormScreen'
import InvoicePreviewScreen from '../screens/InvoicePreviewScreen'

const Stack = createStackNavigator()

export default function InvoiceStack () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='InvoiceList' component={InvoiceListScreen} />
      <Stack.Screen name='InvoiceForm' component={InvoiceFormScreen} />
      <Stack.Screen name='InvoicePreview' component={InvoicePreviewScreen} />
    </Stack.Navigator>
  )
}
