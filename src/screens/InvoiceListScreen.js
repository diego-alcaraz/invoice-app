import React, { useCallback, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FAB, List, Text, Divider, Chip } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function InvoiceListScreen ({ navigation }) {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])

  useFocusEffect(
    useCallback(() => {
      if (user) loadInvoices()
    }, [user])
  )

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*, clients(company_name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setInvoices(data || [])
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={`#${item.invoice_number}`}
      description={`${item.clients?.company_name || 'Unknown'} — $${Number(item.total).toFixed(2)}`}
      left={props => <List.Icon {...props} icon='file-document-outline' />}
      right={() => (
        <Chip
          compact
          style={{ backgroundColor: item.status === 'sent' ? '#2e7d32' : item.status === 'draft' ? '#e6a817' : '#555' }}
          textStyle={{ color: '#fff', fontSize: 12 }}
        >
          {item.status}
        </Chip>
      )}
      onPress={() => navigation.navigate('InvoicePreview', { invoiceId: item.id })}
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text variant='headlineMedium' style={styles.title}>Invoices</Text>
      <FlatList
        data={invoices}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<Text style={styles.empty}>No invoices yet. Tap + to create one.</Text>}
      />
      <FAB icon='plus' style={styles.fab} onPress={() => navigation.navigate('InvoiceForm')} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  title: { padding: 20, fontWeight: 'bold', color: '#c9a84c' },
  empty: { padding: 20, textAlign: 'center', color: '#777' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#c9a84c' }
})
