import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, ActivityIndicator } from 'react-native-paper'
import { useAuth } from '../context/AuthContext'

const PAYMENT_LINK = 'https://buy.stripe.com/cNibJ33Ju2GG7lyannbZe00'

export default function SubscriptionScreen () {
  const { session, fetchProfile } = useAuth()
  const [polling, setPolling] = useState(false)
  const intervalRef = useRef(null)

  const handleCheckout = () => {
    window.open(PAYMENT_LINK, '_blank')
    setPolling(true)
  }

  // Poll for profile changes when user has opened the payment link
  useEffect(() => {
    if (!polling || !session?.user?.id) return

    intervalRef.current = setInterval(() => {
      fetchProfile(session.user.id)
    }, 3000)

    return () => clearInterval(intervalRef.current)
  }, [polling, session?.user?.id])

  // Also re-fetch when tab regains focus (user comes back from Stripe)
  useEffect(() => {
    const onFocus = () => {
      if (session?.user?.id) fetchProfile(session.user.id)
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [session?.user?.id])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>InvoiceApp Pro</Text>
        <Text style={styles.price}>$10 AUD / month</Text>
        <Text style={styles.desc}>
          Full access to invoicing, client management, and PDF exports.
        </Text>
        <Button mode='contained' style={styles.button} labelStyle={styles.buttonLabel} onPress={handleCheckout} disabled={polling}>
          {polling ? 'Waiting for payment...' : 'Subscribe Now'}
        </Button>
        {polling && (
          <Text style={styles.pollText}>
            Complete payment in the new tab. This page will update automatically.
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#c9a84c'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c9a84c',
    textAlign: 'center',
    marginBottom: 8
  },
  price: {
    fontSize: 20,
    color: '#f0e6d0',
    textAlign: 'center',
    marginBottom: 12
  },
  desc: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  button: {
    backgroundColor: '#c9a84c',
    borderRadius: 8
  },
  buttonLabel: {
    color: '#1a1a1a',
    fontWeight: 'bold'
  },
  pollText: {
    color: '#c9a84c',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13
  }
})
