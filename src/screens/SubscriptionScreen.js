import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { CardField, useStripe } from '@stripe/stripe-react-native'
import { supabase } from '../lib/supabase'
import { CREATE_SUBSCRIPTION_URL } from '../lib/stripe'
import { useAuth } from '../context/AuthContext'

export default function SubscriptionScreen () {
  const { session, fetchProfile } = useAuth()
  const { createPaymentMethod } = useStripe()
  const [loading, setLoading] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  const handleSubscribe = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please enter your card details.')
      return
    }

    setLoading(true)
    try {
      const { paymentMethod, error } = await createPaymentMethod({ paymentMethodType: 'Card' })
      if (error) {
        Alert.alert('Error', error.message)
        setLoading(false)
        return
      }

      const res = await fetch(CREATE_SUBSCRIPTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          user_id: session.user.id
        })
      })

      const result = await res.json()
      if (!res.ok) {
        Alert.alert('Error', result.error || 'Subscription failed.')
        setLoading(false)
        return
      }

      await fetchProfile(session.user.id)
    } catch (e) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>InvoiceApp Pro</Text>
        <Text style={styles.price}>$10 AUD / month</Text>
        <Text style={styles.desc}>
          Full access to invoicing, client management, and PDF exports.
        </Text>

        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          cardStyle={{
            backgroundColor: '#2a2a2a',
            textColor: '#f0e6d0',
            placeholderColor: '#666'
          }}
          style={styles.cardField}
          onCardChange={(details) => setCardComplete(details.complete)}
        />

        <Button
          mode='contained'
          onPress={handleSubscribe}
          loading={loading}
          disabled={loading || !cardComplete}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Subscribe Now
        </Button>
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
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#c9a84c',
    borderRadius: 8
  },
  buttonLabel: {
    color: '#1a1a1a',
    fontWeight: 'bold'
  }
})
