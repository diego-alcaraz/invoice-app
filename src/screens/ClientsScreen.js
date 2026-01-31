import React, { useCallback, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FAB, List, Text, Divider } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ClientsScreen ({ navigation }) {
  const { user } = useAuth()
  const [clients, setClients] = useState([])

  useFocusEffect(
    useCallback(() => {
      if (user) loadClients()
    }, [user])
  )

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('company_name')
    setClients(data || [])
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={item.company_name}
      description={item.email}
      left={props => <List.Icon {...props} icon='domain' />}
      onPress={() => navigation.navigate('ClientForm', { client: item })}
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text variant='headlineMedium' style={styles.title}>Clients</Text>
      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<Text style={styles.empty}>No clients yet. Tap + to add one.</Text>}
      />
      <FAB icon='plus' style={styles.fab} onPress={() => navigation.navigate('ClientForm', {})} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  title: { padding: 20, fontWeight: 'bold', color: '#c9a84c' },
  empty: { padding: 20, textAlign: 'center', color: '#777' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#c9a84c' }
})
