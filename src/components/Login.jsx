import React, { useState } from 'react'
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Text } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from '../lib/supabase'

WebBrowser.maybeCompleteAuthSession()

const redirectUri = makeRedirectUri()

export default function LoginScreen () {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true
        }
      })

      if (error) {
        Alert.alert('Error', error.message)
        setLoading(false)
        return
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri)

      if (result.type === 'success') {
        const url = result.url
        const params = new URL(url)
        const fragment = params.hash?.substring(1)
        const query = new URLSearchParams(fragment || params.search?.substring(1))
        const accessToken = query.get('access_token')
        const refreshToken = query.get('refresh_token')

        if (accessToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
        }
      }
    } catch (err) {
      Alert.alert('Error', err.message)
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text variant='headlineLarge' style={styles.title}>InvoiceApp</Text>
        <Text variant='bodyMedium' style={styles.subtitle}>Track invoices, clients, and get paid faster.</Text>
        <Button
          mode='contained'
          icon='google'
          onPress={handleGoogleSignIn}
          loading={loading}
          style={styles.button}
        >
          Sign in with Google
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 8, fontWeight: 'bold', color: '#c9a84c' },
  subtitle: { textAlign: 'center', marginBottom: 32, color: '#999' },
  button: { marginTop: 8 }
})
