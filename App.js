import React from 'react'
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PaperProvider, MD3LightTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { AuthProvider, useAuth } from './src/context/AuthContext'
import LoginScreen from './src/components/Login'
import HomeScreen from './src/screens/HomeScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import InvoiceStack from './src/navigation/InvoiceStack'
import ClientsStack from './src/navigation/ClientsStack'

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#c9a84c',
    primaryContainer: '#3a2f1a',
    secondary: '#c9a84c',
    secondaryContainer: '#2a2a2a',
    surface: '#1a1a1a',
    background: '#111111',
    onSurface: '#f0e6d0',
    onBackground: '#f0e6d0',
    onPrimary: '#1a1a1a',
    outline: '#555',
    elevation: {
      level0: 'transparent',
      level1: '#1e1e1e',
      level2: '#222222',
      level3: '#262626',
      level4: '#2a2a2a',
      level5: '#2e2e2e'
    }
  }
}

const Tab = createBottomTabNavigator()

function MainTabs () {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#c9a84c',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { paddingBottom: 6, paddingTop: 4, height: 56, backgroundColor: '#1a1a1a', borderTopColor: '#333' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Image source={require('./src/icon/LogoM.png')} style={{ width: size, height: size, borderRadius: size / 2 }} />
          }
          const icons = {
            Invoices: 'file-document-outline',
            Clients: 'domain',
            Profile: 'account'
          }
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />
        }
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Invoices' component={InvoiceStack} />
      <Tab.Screen name='Clients' component={ClientsStack} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function RootNavigator () {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color='#c9a84c' />
      </View>
    )
  }

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
        <LoginScreen />
      </SafeAreaView>
    )
  }

  // TODO: re-enable subscription gate when Stripe is configured
  // if (subscriptionStatus !== 'trialing' && subscriptionStatus !== 'active') {
  //   return (
  //     <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
  //       <SubscriptionScreen />
  //     </SafeAreaView>
  //   )
  // }

  return <MainTabs />
}

export default function App () {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111'
  }
})
