import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput, Button, Text } from 'react-native-paper'
import { Formik } from 'formik'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ProfileScreen () {
  const { user, profile, fetchProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const initialValues = {
    name: profile?.name || '',
    abn: profile?.abn || '',
    bank_name: profile?.bank_name || '',
    bank_account: profile?.bank_account || '',
    bsb: profile?.bsb || '',
    email: profile?.email || user?.email || ''
  }

  const handleSave = async (values) => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...values })
    setLoading(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Saved', 'Profile updated successfully')
      fetchProfile(user.id)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>My Profile</Text>
        <Formik initialValues={initialValues} onSubmit={handleSave} enableReinitialize>
          {({ handleChange, handleSubmit, values }) => (
            <View>
              <TextInput label='Name' mode='outlined' value={values.name} onChangeText={handleChange('name')} style={styles.input} />
              <TextInput label='ABN' mode='outlined' value={values.abn} onChangeText={handleChange('abn')} style={styles.input} keyboardType='numeric' />
              <TextInput label='Email' mode='outlined' value={values.email} onChangeText={handleChange('email')} style={styles.input} keyboardType='email-address' />
              <TextInput label='Bank Name' mode='outlined' value={values.bank_name} onChangeText={handleChange('bank_name')} style={styles.input} />
              <TextInput label='BSB' mode='outlined' value={values.bsb} onChangeText={handleChange('bsb')} style={styles.input} keyboardType='numeric' />
              <TextInput label='Account Number' mode='outlined' value={values.bank_account} onChangeText={handleChange('bank_account')} style={styles.input} keyboardType='numeric' />
              <Button mode='contained' onPress={handleSubmit} loading={loading} style={styles.button}>Save Profile</Button>
            </View>
          )}
        </Formik>
        <Button mode='outlined' onPress={signOut} style={styles.button} textColor='red'>Sign Out</Button>
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
