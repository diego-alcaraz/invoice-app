import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gshpommpvkcxxsofyaet.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaHBvbW1wdmtjeHhzb2Z5YWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDAxMDIsImV4cCI6MjA4NTQxNjEwMn0.1hnVRFICPr88Q7T5_r8P64K-vAGJKwBx0mM3j69OB14'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
