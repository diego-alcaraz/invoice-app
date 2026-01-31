import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput, Button, Text } from 'react-native-paper'
import { Formik } from 'formik'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ClientFormScreen ({ route, navigation }) {
  const { user } = useAuth()
  const existing = route.params?.client
  const [loading, setLoading] = useState(false)

  const initialValues = {
    company_name: existing?.company_name || '',
    address: existing?.address || '',
    abn: existing?.abn || '',
    email: existing?.email || '',
    phone: existing?.phone || ''
  }

  const handleSave = async (values) => {
    setLoading(true)
    const payload = { ...values, user_id: user.id }
    let error
    if (existing?.id) {
      ({ error } = await supabase.from('clients').update(payload).eq('id', existing.id))
    } else {
      ({ error } = await supabase.from('clients').insert(payload))
    }
    setLoading(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>{existing ? 'Edit Client' : 'New Client'}</Text>
        <Formik initialValues={initialValues} onSubmit={handleSave}>
          {({ handleChange, handleSubmit, values }) => (
            <View>
              <TextInput label='Company Name' mode='outlined' value={values.company_name} onChangeText={handleChange('company_name')} style={styles.input} />
              <TextInput label='Address' mode='outlined' value={values.address} onChangeText={handleChange('address')} style={styles.input} multiline />
              <TextInput label='ABN' mode='outlined' value={values.abn} onChangeText={handleChange('abn')} style={styles.input} keyboardType='numeric' />
              <TextInput label='Email' mode='outlined' value={values.email} onChangeText={handleChange('email')} style={styles.input} keyboardType='email-address' />
              <TextInput label='Phone' mode='outlined' value={values.phone} onChangeText={handleChange('phone')} style={styles.input} keyboardType='phone-pad' />
              <Button mode='contained' onPress={handleSubmit} loading={loading} style={styles.button}>Save Client</Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 40 },
  title: { marginBottom: 20, fontWeight: 'bold', color: '#c9a84c' },
  input: { marginBottom: 12 },
  button: { marginTop: 12 }
})
