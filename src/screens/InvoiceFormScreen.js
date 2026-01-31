import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput, Button, Text, Menu, IconButton } from 'react-native-paper'
import { Formik, FieldArray } from 'formik'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function InvoiceFormScreen ({ navigation }) {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('company_name')
    setClients(data || [])
  }

  const emptyItem = { date: '', task: '', description: '', hours: '', rate: '' }

  const calcLineTotal = (item) => {
    const h = parseFloat(item.hours) || 0
    const r = parseFloat(item.rate) || 0
    return h * r
  }

  const calcTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + calcLineTotal(item), 0)
    const tax = subtotal * 0.1
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
    const { subtotal, tax, total } = calcTotals(values.items)

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

    const lineItems = values.items.map(item => ({
      invoice_id: invoice.id,
      date: item.date,
      task: item.task,
      description: item.description,
      hours: parseFloat(item.hours) || 0,
      rate: parseFloat(item.rate) || 0,
      total: calcLineTotal(item)
    }))

    const { error: lineError } = await supabase.from('line_items').insert(lineItems)
    setLoading(false)

    if (lineError) {
      Alert.alert('Error', lineError.message)
    } else {
      navigation.replace('InvoicePreview', { invoiceId: invoice.id })
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>New Invoice</Text>
        <Formik
          initialValues={{ client_id: '', client_name: '', invoice_number: '', items: [{ ...emptyItem }] }}
          onSubmit={handleSave}
        >
          {({ handleChange, handleSubmit, values, setFieldValue }) => {
            const { subtotal, tax, total } = calcTotals(values.items)
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
                            <TextInput label='Hours' mode='outlined' value={item.hours} onChangeText={handleChange(`items.${index}.hours`)} style={[styles.input, styles.half]} keyboardType='numeric' />
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

                <View style={styles.totals}>
                  <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
                  <Text>GST (10%): ${tax.toFixed(2)}</Text>
                  <Text variant='titleLarge' style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                </View>

                <Button mode='contained' onPress={handleSubmit} loading={loading} style={styles.button}>
                  Save Invoice
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
  lineItem: { backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8, marginBottom: 12, borderColor: '#333', borderWidth: 1 },
  lineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineTotal: { textAlign: 'right', fontWeight: 'bold', color: '#c9a84c' },
  addButton: { marginBottom: 16 },
  totals: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 8, marginBottom: 16, borderColor: '#c9a84c', borderWidth: 1 },
  totalText: { fontWeight: 'bold', marginTop: 8, color: '#c9a84c' },
  button: { marginTop: 8 }
})
