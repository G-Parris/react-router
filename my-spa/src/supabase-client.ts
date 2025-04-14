import {createClient} from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. See .env setup in Vite docs.");
}

export const supabase = createClient(
    supabaseUrl, 
    supabaseAnonKey
);