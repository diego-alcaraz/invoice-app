import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
  }

  const updateProfile = async (customerId: string, updates: Record<string, unknown>) => {
    await supabase
      .from('profiles')
      .update(updates)
      .eq('stripe_customer_id', customerId)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      // Fetch subscription to get status and trial end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null

      // Check if a profile already has this stripe_customer_id
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (!existing) {
        // No profile linked yet — match by email from session or Stripe customer
        let email = session.customer_email
        if (!email) {
          const customer = await stripe.customers.retrieve(customerId)
          if (!customer.deleted) email = customer.email
        }
        if (email) {
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              subscription_status: subscription.status,
              trial_ends_at: trialEnd,
            })
            .eq('email', email)
        }
      } else {
        await updateProfile(customerId, {
          subscription_status: subscription.status,
          trial_ends_at: trialEnd,
        })
      }
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null

      await updateProfile(customerId, {
        subscription_status: subscription.status,
        trial_ends_at: trialEnd,
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await updateProfile(customerId, {
        subscription_status: 'past_due',
      })
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
