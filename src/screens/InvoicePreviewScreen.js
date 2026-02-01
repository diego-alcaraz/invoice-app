import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Alert, Platform, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, Button, DataTable, Portal, Modal, Divider } from 'react-native-paper'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { generateInvoiceHtml } from '../utils/invoiceHtml'

const isWeb = Platform.OS === 'web'

export default function InvoicePreviewScreen ({ route, navigation }) {
  const { invoiceId } = route.params
  const { profile } = useAuth()
  const [invoice, setInvoice] = useState(null)
  const [lineItems, setLineItems] = useState([])
  const [client, setClient] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

    if (isWeb) {
      const w = window.open('', '_blank')
      w.document.write(html)
      w.document.close()
    } else {
      const { uri } = await Print.printToFileAsync({ html })
      await Sharing.shareAsync(uri)
    }
  }

  const buildMailto = () => {
    const to = client?.email || ''
    const userName = profile?.name || ''
    const invNum = invoice?.invoice_number || ''
    const total = Number(invoice?.total || 0).toFixed(2)
    const subject = `Invoice #${invNum} - ${userName}`
    const body = `Hi ${client?.company_name || ''},

I hope this message finds you well.

Please find attached Invoice #${invNum} for the amount of $${total} AUD.

Payment details:
Bank: ${profile?.bank_name || 'N/A'}
BSB: ${profile?.bsb || 'N/A'}
Account: ${profile?.bank_account || 'N/A'}
ABN: ${profile?.abn || 'N/A'}

If you have any questions, feel free to reach out.

Thank you for your business — it's a pleasure working with you!

Kind regards,
${userName}
${profile?.email || ''}`

    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleSendInvoice = async () => {
    setSending(true)

    await supabase
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', invoice.id)

    setInvoice(prev => ({ ...prev, status: 'sent' }))
    setConfirmVisible(false)
    setSending(false)

    if (isWeb) {
      const a = document.createElement('a')
      a.href = buildMailto()
      a.click()
    } else {
      const html = generateInvoiceHtml({ invoice, lineItems, client, profile })
      const { uri } = await Print.printToFileAsync({ html })
      const canShare = await Sharing.isAvailableAsync()
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Send Invoice #${invoice.invoice_number}`
        })
      } else {
        Linking.openURL(buildMailto())
      }
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await supabase.from('line_items').delete().eq('invoice_id', invoice.id)
      await supabase.from('invoices').delete().eq('id', invoice.id)
      navigation.goBack()
    } catch (e) {
      Alert.alert('Error', e.message)
      setDeleting(false)
    }
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
          {client?.abn ? <Text>ABN: {client.abn}</Text> : null}
          {client?.email ? <Text>{client.email}</Text> : null}
        </View>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title style={styles.taskCol}>Task</DataTable.Title>
            <DataTable.Title numeric>Hours</DataTable.Title>
            <DataTable.Title numeric>Rate</DataTable.Title>
            <DataTable.Title numeric>Total</DataTable.Title>
          </DataTable.Header>
          {lineItems.map(item => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell><Text style={styles.cellText}>{item.date}</Text></DataTable.Cell>
              <DataTable.Cell style={styles.taskCol}><Text style={styles.cellText} numberOfLines={0}>{item.task}{item.description ? `\n${item.description}` : ''}</Text></DataTable.Cell>
              <DataTable.Cell numeric><Text style={styles.cellText}>{Number(item.hours).toFixed(2)}</Text></DataTable.Cell>
              <DataTable.Cell numeric><Text style={styles.cellText}>${Number(item.rate).toFixed(2)}</Text></DataTable.Cell>
              <DataTable.Cell numeric><Text style={styles.cellText}>${Number(item.total).toFixed(2)}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        <View style={styles.totals}>
          <Text>Subtotal: ${Number(invoice.subtotal).toFixed(2)}</Text>
          {Number(invoice.tax) > 0 ? <Text>GST (10%): ${Number(invoice.tax).toFixed(2)}</Text> : null}
          <Text variant='titleLarge' style={styles.totalText}>Total: ${Number(invoice.total).toFixed(2)}</Text>
        </View>

        <Button mode='outlined' icon='pencil' onPress={() => navigation.navigate('InvoiceForm', { invoiceId: invoice.id })} style={styles.button}>
          Edit Invoice
        </Button>

        <Button mode='contained' icon='file-pdf-box' onPress={handleGeneratePdf} style={styles.button}>
          {isWeb ? 'View / Print Invoice' : 'Generate PDF'}
        </Button>

        <Button mode='contained' icon='send' onPress={() => setConfirmVisible(true)} style={[styles.button, styles.sendButton]}>
          Send Invoice
        </Button>

        <Button mode='outlined' icon='delete' onPress={() => setDeleteVisible(true)} style={[styles.button, styles.deleteButton]} textColor='#e74c3c'>
          Delete Invoice
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
              {isWeb
                ? 'This will open your email client with the invoice details pre-filled. The invoice status will be marked as "sent".'
                : 'This will generate a PDF and open your share sheet. The invoice status will be marked as "sent".'}
            </Text>

            <View style={styles.modalActions}>
              <Button mode='outlined' onPress={() => setConfirmVisible(false)} style={styles.modalBtn}>Cancel</Button>
              <Button mode='contained' onPress={handleSendInvoice} loading={sending} style={styles.modalBtn}>Confirm & Send</Button>
            </View>
          </Modal>
          <Modal visible={deleteVisible} onDismiss={() => setDeleteVisible(false)} contentContainerStyle={styles.modal}>
            <Text variant='titleLarge' style={[styles.modalTitle, { color: '#e74c3c' }]}>Delete Invoice</Text>
            <Divider style={styles.modalDivider} />
            <Text>Are you sure you want to delete Invoice #{invoice.invoice_number}? This action cannot be undone.</Text>
            <View style={styles.modalActions}>
              <Button mode='outlined' onPress={() => setDeleteVisible(false)} style={styles.modalBtn}>Cancel</Button>
              <Button mode='contained' onPress={handleDelete} loading={deleting} buttonColor='#e74c3c' style={styles.modalBtn}>Delete</Button>
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
  taskCol: { flex: 2 },
  cellText: { color: '#f0e6d0', fontSize: 12 },
  totals: { marginTop: 16, padding: 16, backgroundColor: '#1e1e1e', borderRadius: 8, borderColor: '#c9a84c', borderWidth: 1 },
  totalText: { fontWeight: 'bold', marginTop: 8, color: '#c9a84c' },
  button: { marginTop: 12 },
  sendButton: { backgroundColor: '#c9a84c' },
  deleteButton: { marginTop: 24, borderColor: '#e74c3c' },
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
