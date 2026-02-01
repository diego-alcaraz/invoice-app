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
    email: profile?.email || user?.email || '',
    default_rate: profile?.default_rate ? String(profile.default_rate) : '',
    default_start_hour: profile?.default_start_hour || '',
    default_end_hour: profile?.default_end_hour || '',
    default_break_time: profile?.default_break_time ? String(profile.default_break_time) : ''
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
              <TextInput label='Default Hourly Rate ($)' mode='outlined' value={values.default_rate} onChangeText={handleChange('default_rate')} style={styles.input} keyboardType='numeric' />
              <View style={styles.row}>
                <TextInput label='Usual Start (HH:MM)' mode='outlined' value={values.default_start_hour} onChangeText={handleChange('default_start_hour')} style={[styles.input, styles.third]} placeholder='08:00' />
                <TextInput label='Usual End (HH:MM)' mode='outlined' value={values.default_end_hour} onChangeText={handleChange('default_end_hour')} style={[styles.input, styles.third]} placeholder='16:00' />
                <TextInput label='Usual Break (min)' mode='outlined' value={values.default_break_time} onChangeText={handleChange('default_break_time')} style={[styles.input, styles.third]} keyboardType='numeric' placeholder='30' />
              </View>
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
  row: { flexDirection: 'row', gap: 12 },
  third: { flex: 1 },
  button: { marginTop: 12 }
})
