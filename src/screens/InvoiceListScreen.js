import React, { useCallback, useState } from 'react'
import { View, FlatList, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FAB, List, Text, Divider, Chip, Searchbar } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function InvoiceListScreen ({ navigation }) {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')

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

  const filtered = invoices.filter(inv => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (inv.invoice_number || '').toLowerCase().includes(q) ||
      (inv.clients?.company_name || '').toLowerCase().includes(q)
    )
  })

  const drafts = filtered.filter(i => i.status === 'draft')
  const sent = filtered.filter(i => i.status === 'sent')

  const renderItem = ({ item }) => (
    <List.Item
      title={`#${item.invoice_number}`}
      description={`${item.clients?.company_name || 'Unknown'} — $${Number(item.total).toFixed(2)}`}
      left={props => <List.Icon {...props} icon='file-document-outline' />}
      onPress={() => navigation.navigate('InvoicePreview', { invoiceId: item.id })}
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text variant='headlineMedium' style={styles.title}>Invoices</Text>

      <Searchbar
        placeholder='Search by number or client'
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor='#999'
        placeholderTextColor='#666'
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='titleMedium' style={styles.sectionTitle}>Drafts ({drafts.length})</Text>
        {drafts.length === 0
          ? <Text style={styles.empty}>No drafts</Text>
          : drafts.map(item => (
            <View key={item.id}>
              {renderItem({ item })}
              <Divider style={styles.divider} />
            </View>
          ))
        }

        <Text variant='titleMedium' style={[styles.sectionTitle, styles.sentTitle]}>Sent ({sent.length})</Text>
        {sent.length === 0
          ? <Text style={styles.empty}>No sent invoices</Text>
          : sent.map(item => (
            <View key={item.id}>
              {renderItem({ item })}
              <Divider style={styles.divider} />
            </View>
          ))
        }
      </ScrollView>

      <FAB icon='plus' style={styles.fab} onPress={() => navigation.navigate('InvoiceForm')} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  title: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, fontWeight: 'bold', color: '#c9a84c' },
  search: { marginHorizontal: 20, marginBottom: 12, backgroundColor: '#1e1e1e', borderRadius: 8 },
  searchInput: { color: '#f0e6d0' },
  content: { paddingHorizontal: 20, paddingBottom: 80 },
  sectionTitle: { fontWeight: 'bold', color: '#e6a817', marginBottom: 8 },
  sentTitle: { color: '#2e7d32', marginTop: 20 },
  empty: { color: '#777', paddingVertical: 12, textAlign: 'center' },
  divider: { backgroundColor: '#333' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#c9a84c' }
})
