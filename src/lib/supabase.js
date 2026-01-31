import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gshpommpvkcxxsofyaet.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_f8p7Nz5j-EwZsHyapwyFfw_VzAlGnqZ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
