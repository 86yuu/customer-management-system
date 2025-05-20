
import { supabase } from "@/integrations/supabase/client";

export interface Sales {
  transno: string;
  salesdate: string | null;
  custno: string | null;
  empno: string | null;
}

export const getSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('salesdate', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
  
  return data as Sales[];
};
