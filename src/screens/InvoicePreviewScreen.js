import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, Button, DataTable, Portal, Modal, Divider } from 'react-native-paper'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { generateInvoiceHtml } from '../utils/invoiceHtml'

export default function InvoicePreviewScreen ({ route }) {
  const { invoiceId } = route.params
  const { profile } = useAuth()
  const [invoice, setInvoice] = useState(null)
  const [lineItems, setLineItems] = useState([])
  const [client, setClient] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadInvoice()
  }, [])

  const loadInvoice = async () => {
    const { data: inv } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('id', invoiceId)
      .single()
    if (inv) {
      setInvoice(inv)
      setClient(inv.clients)
    }
    const { data: items } = await supabase
      .from('line_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('date')
    setLineItems(items || [])
  }

  const handleGeneratePdf = async () => {
    if (!invoice || !profile) {
      Alert.alert('Error', 'Invoice data not loaded')
      return
    }
    const html = generateInvoiceHtml({ invoice, lineItems, client, profile })
    const { uri } = await Print.printToFileAsync({ html })
    await Sharing.shareAsync(uri)
  }

  const handleSendInvoice = async () => {
    setSending(true)
    const html = generateInvoiceHtml({ invoice, lineItems, client, profile })
    const { uri } = await Print.printToFileAsync({ html })

    await supabase
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', invoice.id)

    setInvoice(prev => ({ ...prev, status: 'sent' }))
    setConfirmVisible(false)
    setSending(false)

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Send Invoice #${invoice.invoice_number}`
    })
  }

  if (!invoice) {
    return <View style={styles.center}><Text>Loading...</Text></View>
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>Invoice #{invoice.invoice_number}</Text>

        <View style={styles.section}>
          <Text variant='titleSmall'>Bill To</Text>
          <Text>{client?.company_name}</Text>
          <Text>{client?.address}</Text>
          <Text>{client?.email}</Text>
        </View>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Task</DataTable.Title>
            <DataTable.Title numeric>Hours</DataTable.Title>
            <DataTable.Title numeric>Rate</DataTable.Title>
            <DataTable.Title numeric>Total</DataTable.Title>
          </DataTable.Header>
          {lineItems.map(item => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.date}</DataTable.Cell>
              <DataTable.Cell>{item.task}{item.description ? `\n${item.description}` : ''}</DataTable.Cell>
              <DataTable.Cell numeric>{item.hours}</DataTable.Cell>
              <DataTable.Cell numeric>${Number(item.rate).toFixed(2)}</DataTable.Cell>
              <DataTable.Cell numeric>${Number(item.total).toFixed(2)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        <View style={styles.totals}>
          <Text>Subtotal: ${Number(invoice.subtotal).toFixed(2)}</Text>
          <Text>GST (10%): ${Number(invoice.tax).toFixed(2)}</Text>
          <Text variant='titleLarge' style={styles.totalText}>Total: ${Number(invoice.total).toFixed(2)}</Text>
        </View>

        <Button mode='contained' icon='file-pdf-box' onPress={handleGeneratePdf} style={styles.button}>
          Generate PDF
        </Button>

        <Button mode='contained' icon='send' onPress={() => setConfirmVisible(true)} style={[styles.button, styles.sendButton]}>
          Send Invoice
        </Button>

        <Portal>
          <Modal visible={confirmVisible} onDismiss={() => setConfirmVisible(false)} contentContainerStyle={styles.modal}>
            <Text variant='titleLarge' style={styles.modalTitle}>Confirm Send</Text>
            <Divider style={styles.modalDivider} />

            <Text variant='labelLarge' style={styles.modalLabel}>Invoice</Text>
            <Text>#{invoice.invoice_number}</Text>

            <Text variant='labelLarge' style={styles.modalLabel}>To</Text>
            <Text>{client?.company_name}</Text>
            <Text style={styles.modalSub}>{client?.email}</Text>

            <Text variant='labelLarge' style={styles.modalLabel}>Amount</Text>
            <Text variant='titleMedium' style={styles.modalAmount}>${Number(invoice.total).toFixed(2)}</Text>

            <Text variant='labelLarge' style={styles.modalLabel}>Items</Text>
            {lineItems.map(item => (
              <Text key={item.id} style={styles.modalItem}>
                - {item.task || item.description} ({item.hours}h x ${Number(item.rate).toFixed(2)})
              </Text>
            ))}

            <Divider style={styles.modalDivider} />

            <Text variant='bodySmall' style={styles.modalNote}>
              This will generate a PDF and open your share sheet. The invoice status will be marked as "sent".
            </Text>

            <View style={styles.modalActions}>
              <Button mode='outlined' onPress={() => setConfirmVisible(false)} style={styles.modalBtn}>Cancel</Button>
              <Button mode='contained' onPress={handleSendInvoice} loading={sending} style={styles.modalBtn}>Confirm & Send</Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { marginBottom: 20, fontWeight: 'bold', color: '#c9a84c' },
  section: { marginBottom: 16, padding: 12, backgroundColor: '#1e1e1e', borderRadius: 8, borderColor: '#333', borderWidth: 1 },
  totals: { marginTop: 16, padding: 16, backgroundColor: '#1e1e1e', borderRadius: 8, borderColor: '#c9a84c', borderWidth: 1 },
  totalText: { fontWeight: 'bold', marginTop: 8, color: '#c9a84c' },
  button: { marginTop: 12 },
  sendButton: { backgroundColor: '#c9a84c' },
  modal: { backgroundColor: '#1e1e1e', margin: 20, borderRadius: 12, padding: 24, borderColor: '#c9a84c', borderWidth: 1 },
  modalTitle: { fontWeight: 'bold', marginBottom: 8, color: '#c9a84c' },
  modalDivider: { marginVertical: 12, backgroundColor: '#333' },
  modalLabel: { color: '#999', marginTop: 8, marginBottom: 2 },
  modalSub: { color: '#888', fontSize: 13 },
  modalAmount: { fontWeight: 'bold', color: '#c9a84c' },
  modalItem: { color: '#ccc', marginLeft: 4, marginBottom: 2 },
  modalNote: { color: '#777', textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalBtn: { flex: 1 }
})
