import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const PRICE_ID = Deno.env.get('STRIPE_PRICE_ID')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payment_method_id, user_id } = await req.json()

    // Get user email from Supabase auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { data: { user } } = await supabase.auth.admin.getUserById(user_id)
    if (!user) throw new Error('User not found')

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: payment_method_id,
      invoice_settings: { default_payment_method: payment_method_id },
    })

    // Create subscription with 15-day trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: PRICE_ID }],
      trial_period_days: 15,
      expand: ['latest_invoice.payment_intent'],
    })

    // Update profile
    const trialEnd = new Date(subscription.trial_end! * 1000).toISOString()
    await supabase.from('profiles').update({
      subscription_status: subscription.status,
      trial_ends_at: trialEnd,
      stripe_customer_id: customer.id,
    }).eq('id', user_id)

    return new Response(JSON.stringify({ subscription_id: subscription.id, status: subscription.status }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
