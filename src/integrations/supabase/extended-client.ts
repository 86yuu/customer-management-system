
import { createClient } from '@supabase/supabase-js';
import { ExtendedDatabase } from '@/types/supabase';

const SUPABASE_URL = "https://wbjbvtaqkiczhlyzaupu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiamJ2dGFxa2ljemhseXphdXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTg0ODcsImV4cCI6MjA1OTIzNDQ4N30.hVD3AQHbK-tlKZ3xWzWOtto2IFb71h9-Ud_VmShr4BI";

// Export the extended Supabase client
export const extendedSupabase = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
