import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-paper'

const PAYMENT_LINK = 'https://buy.stripe.com/cNibJ33Ju2GG7lyannbZe00'

export default function SubscriptionScreen () {
  const handleCheckout = () => {
    window.open(PAYMENT_LINK, '_blank')
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>InvoiceApp Pro</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>15-day free trial</Text>
        </View>
        <Text style={styles.price}>$10 AUD / month</Text>
        <Text style={styles.desc}>
          Full access to invoicing, client management, and PDF exports. Your card will be charged after the trial ends.
        </Text>
        <Button mode='contained' style={styles.button} labelStyle={styles.buttonLabel} onPress={handleCheckout}>
          Start Free Trial
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
  badge: {
    alignSelf: 'center',
    backgroundColor: '#c9a84c',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12
  },
  badgeText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 13
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
  }
})
