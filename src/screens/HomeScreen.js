import React, { useCallback, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Card, Button, Divider } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function HomeScreen () {
  const { user, profile } = useAuth()
  const navigation = useNavigation()
  const [stats, setStats] = useState({ totalEarned: 0, pending: 0, clients: 0 })
  const [recentInvoices, setRecentInvoices] = useState([])

  useFocusEffect(
    useCallback(() => {
      if (user) loadDashboard()
    }, [user])
  )

  const loadDashboard = async () => {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*, clients(company_name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const all = invoices || []
    const totalEarned = all.reduce((sum, i) => sum + Number(i.total || 0), 0)
    const pending = all.filter(i => i.status === 'draft').length

    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    setStats({ totalEarned, pending, clients: clientCount || 0 })
    setRecentInvoices(all.slice(0, 5))
  }

  const firstName = profile?.name?.split(' ')[0] || 'there'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant='headlineMedium' style={styles.greeting}>Hey {firstName} 👋</Text>
      <Text variant='bodyMedium' style={styles.subtitle}>Here's your overview</Text>

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: '#1e1e1e', borderColor: '#c9a84c', borderWidth: 1 }]}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.statNumber}>${stats.totalEarned.toFixed(2)}</Text>
            <Text variant='bodySmall' style={styles.statLabel}>Total Earned</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#1e1e1e', borderColor: '#c9a84c', borderWidth: 1 }]}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.statNumber}>{stats.pending}</Text>
            <Text variant='bodySmall' style={styles.statLabel}>Draft Invoices</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#1e1e1e', borderColor: '#c9a84c', borderWidth: 1 }]}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.statNumber}>{stats.clients}</Text>
            <Text variant='bodySmall' style={styles.statLabel}>Clients</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button
          mode='contained'
          icon='plus'
          onPress={() => navigation.getParent()?.navigate('Invoices', { screen: 'InvoiceForm' })}
          style={styles.actionBtn}
        >
          New Invoice
        </Button>
        <Button
          mode='outlined'
          icon='account-plus'
          onPress={() => navigation.getParent()?.navigate('Clients', { screen: 'ClientForm' })}
          style={styles.actionBtn}
        >
          Add Client
        </Button>
      </View>

      <Divider style={styles.divider} />

      <Text variant='titleMedium' style={styles.sectionTitle}>Recent Invoices</Text>
      {recentInvoices.length === 0
        ? <Text style={styles.empty}>No invoices yet. Create your first one!</Text>
        : recentInvoices.map(inv => (
          <Card key={inv.id} style={styles.invoiceCard} onPress={() => navigation.getParent()?.navigate('Invoices', { screen: 'InvoicePreview', params: { invoiceId: inv.id } })}>
            <Card.Content style={styles.invoiceRow}>
              <View>
                <Text variant='titleSmall'>#{inv.invoice_number || '—'}</Text>
                <Text variant='bodySmall' style={styles.clientName}>{inv.clients?.company_name || 'Unknown'}</Text>
              </View>
              <View style={styles.invoiceRight}>
                <Text variant='titleSmall'>${Number(inv.total).toFixed(2)}</Text>
                <Text variant='bodySmall' style={[styles.status, inv.status === 'draft' && styles.statusDraft]}>{inv.status}</Text>
              </View>
            </Card.Content>
          </Card>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 40 },
  greeting: { fontWeight: 'bold', marginBottom: 4, color: '#c9a84c' },
  subtitle: { color: '#999', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 12, elevation: 0 },
  statNumber: { fontWeight: 'bold', textAlign: 'center', color: '#c9a84c' },
  statLabel: { textAlign: 'center', color: '#bbb', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: { flex: 1 },
  divider: { marginBottom: 20, backgroundColor: '#333' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, color: '#f0e6d0' },
  empty: { color: '#777', textAlign: 'center', paddingVertical: 20 },
  invoiceCard: { marginBottom: 8, borderRadius: 10, backgroundColor: '#1e1e1e' },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientName: { color: '#999' },
  invoiceRight: { alignItems: 'flex-end' },
  status: { textTransform: 'capitalize', color: '#c9a84c' },
  statusDraft: { color: '#e6a817' }
})
