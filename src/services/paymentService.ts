
import { supabase } from "@/integrations/supabase/client";

export interface Payment {
  orno: string;
  paydate: string | null;
  amount: number | null;
  transno: string | null;
}

export const getPayments = async () => {
  const { data, error } = await supabase
    .from('payment')
    .select('*')
    .order('paydate', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
  
  return data as Payment[];
};
