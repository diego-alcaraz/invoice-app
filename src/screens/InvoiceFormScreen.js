import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput, Button, Text, Menu, IconButton, Switch } from 'react-native-paper'
import { Formik, FieldArray } from 'formik'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function InvoiceFormScreen ({ navigation, route }) {
  const { user, profile } = useAuth()
  const defaultRate = profile?.default_rate ? String(profile.default_rate) : ''
  const defaultStartHour = profile?.default_start_hour || ''
  const defaultEndHour = profile?.default_end_hour || ''
  const defaultBreakTime = profile?.default_break_time ? String(profile.default_break_time) : ''
  const editInvoiceId = route.params?.invoiceId
  const [clients, setClients] = useState([])
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('001')
  const [editInitialValues, setEditInitialValues] = useState(null)

  useEffect(() => {
    loadClients()
    if (editInvoiceId) {
      loadExistingInvoice()
    } else {
      loadNextInvoiceNumber()
    }
  }, [])

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('company_name')
    setClients(data || [])
  }

  const loadNextInvoiceNumber = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data?.invoice_number) {
      const num = parseInt(data.invoice_number, 10)
      if (!isNaN(num)) {
        setNextInvoiceNumber(String(num + 1).padStart(3, '0'))
      }
    }
  }

  const loadExistingInvoice = async () => {
    const { data: inv } = await supabase
      .from('invoices')
      .select('*, clients(company_name)')
      .eq('id', editInvoiceId)
      .single()
    const { data: items } = await supabase
      .from('line_items')
      .select('*')
      .eq('invoice_id', editInvoiceId)
      .order('date')
    if (inv) {
      setEditInitialValues({
        client_id: inv.client_id,
        client_name: inv.clients?.company_name || '',
        invoice_number: inv.invoice_number || '',
        include_gst: Number(inv.tax) > 0,
        items: (items || []).map(i => {
          let desc = i.description || ''
          let startHour = ''
          let endHour = ''
          let breakTime = ''
          const timeMatch = desc.match(/Start: (\S+) \| End: (\S+)(?:\s*\|\s*Break: (\S+?)(?:min|h))?/)
          if (timeMatch) {
            startHour = timeMatch[1]
            endHour = timeMatch[2]
            breakTime = timeMatch[3] || ''
            desc = desc.replace(/\n?Start: .+$/, '').trim()
          }
          return {
            date: i.date || '',
            task: i.task || '',
            description: desc,
            start_hour: startHour,
            end_hour: endHour,
            break_time: breakTime,
            rate: String(i.rate || '')
          }
        })
      })
    }
  }

  const emptyItem = { date: '', task: '', description: '', start_hour: defaultStartHour, end_hour: defaultEndHour, break_time: defaultBreakTime, rate: defaultRate }

  const parseTime = (str) => {
    if (!str) return null
    const parts = str.split(':')
    if (parts.length !== 2) return null
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (isNaN(h) || isNaN(m)) return null
    return h + m / 60
  }

  const calcHours = (item) => {
    const start = parseTime(item.start_hour)
    const end = parseTime(item.end_hour)
    const brkMin = parseFloat(item.break_time) || 0
    if (start === null || end === null) return 0
    const worked = end - start - (brkMin / 60)
    return worked > 0 ? worked : 0
  }

  const calcLineTotal = (item) => {
    const h = calcHours(item)
    const r = parseFloat(item.rate) || 0
    return h * r
  }

  const calcTotals = (items, includeGst) => {
    const subtotal = items.reduce((sum, item) => sum + calcLineTotal(item), 0)
    const tax = includeGst ? subtotal * 0.1 : 0
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleSave = async (values) => {
    if (!values.client_id) {
      Alert.alert('Error', 'Please select a client')
      return
    }
    if (values.items.length === 0) {
      Alert.alert('Error', 'Add at least one line item')
      return
    }

    setLoading(true)
    const { subtotal, tax, total } = calcTotals(values.items, values.include_gst)

    let invoiceId = editInvoiceId
    if (editInvoiceId) {
      const { error } = await supabase
        .from('invoices')
        .update({
          client_id: values.client_id,
          invoice_number: values.invoice_number,
          subtotal,
          tax,
          total
        })
        .eq('id', editInvoiceId)
      if (error) {
        setLoading(false)
        Alert.alert('Error', error.message)
        return
      }
      await supabase.from('line_items').delete().eq('invoice_id', editInvoiceId)
    } else {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          client_id: values.client_id,
          invoice_number: values.invoice_number,
          subtotal,
          tax,
          total,
          status: 'draft'
        })
        .select()
        .single()
      if (error) {
        setLoading(false)
        Alert.alert('Error', error.message)
        return
      }
      invoiceId = invoice.id
    }

    const lineItems = values.items.map(item => {
      const hours = calcHours(item)
      const timeParts = []
      if (item.start_hour) timeParts.push(`Start: ${item.start_hour}`)
      if (item.end_hour) timeParts.push(`End: ${item.end_hour}`)
      if (item.break_time) timeParts.push(`Break: ${item.break_time}min`)
      const timeNote = timeParts.length ? timeParts.join(' | ') : ''
      const desc = [item.description, timeNote].filter(Boolean).join('\n')
      return {
        invoice_id: invoiceId,
        date: item.date,
        task: item.task,
        description: desc,
        hours,
        rate: parseFloat(item.rate) || 0,
        total: hours * (parseFloat(item.rate) || 0)
      }
    })

    const { error: lineError } = await supabase.from('line_items').insert(lineItems)
    setLoading(false)

    if (lineError) {
      Alert.alert('Error', lineError.message)
    } else {
      navigation.replace('InvoicePreview', { invoiceId })
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>{editInvoiceId ? 'Edit Invoice' : 'New Invoice'}</Text>
        <Formik
          enableReinitialize
          initialValues={editInitialValues || { client_id: '', client_name: '', invoice_number: nextInvoiceNumber, include_gst: true, items: [{ date: '', task: '', description: '', start_hour: defaultStartHour, end_hour: defaultEndHour, break_time: defaultBreakTime, rate: defaultRate }] }}
          onSubmit={handleSave}
        >
          {({ handleChange, handleSubmit, values, setFieldValue }) => {
            const { subtotal, tax, total } = calcTotals(values.items, values.include_gst)
            return (
              <View>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Button mode='outlined' onPress={() => setMenuVisible(true)} style={styles.input}>
                      {values.client_name || 'Select Client'}
                    </Button>
                  }
                >
                  {clients.map(c => (
                    <Menu.Item
                      key={c.id}
                      title={c.company_name}
                      onPress={() => {
                        setFieldValue('client_id', c.id)
                        setFieldValue('client_name', c.company_name)
                        setMenuVisible(false)
                      }}
                    />
                  ))}
                </Menu>

                <TextInput
                  label='Invoice Number'
                  mode='outlined'
                  value={values.invoice_number}
                  onChangeText={handleChange('invoice_number')}
                  style={styles.input}
                />

                <FieldArray name='items'>
                  {({ push, remove }) => (
                    <View>
                      <Text variant='titleMedium' style={styles.sectionTitle}>Line Items</Text>
                      {values.items.map((item, index) => (
                        <View key={index} style={styles.lineItem}>
                          <View style={styles.lineHeader}>
                            <Text variant='labelLarge'>Item {index + 1}</Text>
                            {values.items.length > 1 && (
                              <IconButton icon='delete' size={20} onPress={() => remove(index)} />
                            )}
                          </View>
                          <TextInput label='Date' mode='outlined' value={item.date} onChangeText={handleChange(`items.${index}.date`)} style={styles.input} placeholder='DD/MM/YYYY' />
                          <TextInput label='Task' mode='outlined' value={item.task} onChangeText={handleChange(`items.${index}.task`)} style={styles.input} placeholder='e.g. Website Redesign' />
                          <TextInput label='Description' mode='outlined' value={item.description} onChangeText={handleChange(`items.${index}.description`)} style={styles.input} multiline placeholder='Details about the work done' />
                          <View style={styles.row}>
                            <TextInput label='Start (HH:MM)' mode='outlined' value={item.start_hour} onChangeText={handleChange(`items.${index}.start_hour`)} style={[styles.input, styles.third]} placeholder='08:00' />
                            <TextInput label='End (HH:MM)' mode='outlined' value={item.end_hour} onChangeText={handleChange(`items.${index}.end_hour`)} style={[styles.input, styles.third]} placeholder='16:00' />
                            <TextInput label='Break (min)' mode='outlined' value={item.break_time} onChangeText={handleChange(`items.${index}.break_time`)} style={[styles.input, styles.third]} keyboardType='numeric' placeholder='30' />
                          </View>
                          <Text style={styles.hoursCalc}>Hours: {calcHours(item).toFixed(2)}</Text>
                          <View style={styles.row}>
                            <TextInput label='Rate ($)' mode='outlined' value={item.rate} onChangeText={handleChange(`items.${index}.rate`)} style={[styles.input, styles.half]} keyboardType='numeric' />
                          </View>
                          <Text style={styles.lineTotal}>Line Total: ${calcLineTotal(item).toFixed(2)}</Text>
                        </View>
                      ))}
                      <Button mode='outlined' icon='plus' onPress={() => push({ ...emptyItem })} style={styles.addButton}>
                        Add Line Item
                      </Button>
                    </View>
                  )}
                </FieldArray>

                <View style={styles.gstRow}>
                  <Text style={styles.gstLabel}>Include GST (10%)</Text>
                  <Switch value={values.include_gst} onValueChange={(v) => setFieldValue('include_gst', v)} color='#c9a84c' />
                </View>

                <View style={styles.totals}>
                  <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
                  {values.include_gst ? <Text>GST (10%): ${tax.toFixed(2)}</Text> : null}
                  <Text variant='titleLarge' style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                </View>

                <Button mode='contained' onPress={handleSubmit} loading={loading} style={styles.button}>
                  {editInvoiceId ? 'Update Invoice' : 'Save Invoice'}
                </Button>
              </View>
            )
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 60 },
  title: { marginBottom: 20, fontWeight: 'bold', color: '#c9a84c' },
  sectionTitle: { marginTop: 16, marginBottom: 8, color: '#f0e6d0' },
  input: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  third: { flex: 1 },
  hoursCalc: { color: '#c9a84c', marginBottom: 8, fontSize: 13 },
  lineItem: { backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8, marginBottom: 12, borderColor: '#333', borderWidth: 1 },
  lineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineTotal: { textAlign: 'right', fontWeight: 'bold', color: '#c9a84c' },
  addButton: { marginBottom: 16 },
  gstRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  gstLabel: { color: '#f0e6d0', fontSize: 15 },
  totals: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 8, marginBottom: 16, borderColor: '#c9a84c', borderWidth: 1 },
  totalText: { fontWeight: 'bold', marginTop: 8, color: '#c9a84c' },
  button: { marginTop: 8 }
})
