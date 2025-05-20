import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  custno: string;
  custname: string;
  address: string;
  payterm: string;
}

export const getCustomers = async (searchQuery?: string) => {
  let query = supabase
    .from('customer')
    .select('*');
  
  if (searchQuery) {
    query = query.or(`custno.ilike.%${searchQuery}%,custname.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);
  }
  
  const { data, error } = await query.order('custname');
  
  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
  
  return data as Customer[];
};

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .order('custname');
  
  if (error) {
    console.error("Error fetching all customers:", error);
    throw error;
  }
  
  return data as Customer[];
};

export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .eq('custno', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
  
  return data as Customer | null;
};

export const getNextCustomerId = async () => {
  // Fetch the customer with the highest numeric custno
  const { data, error } = await supabase
    .from('customer')
    .select('custno')
    .order('custno', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error("Error fetching last customer ID:", error);
    throw error;
  }
  
  // Default starting ID if no customers exist
  let nextId = "C0001";
  
  if (data && data.length > 0) {
    const lastId = data[0].custno;
    
    // Check if the last ID follows the pattern C#### (where # is a digit)
    if (lastId.match(/^C\d+$/)) {
      // Extract the number part, increment it, and format it back with leading zeros
      const numPart = parseInt(lastId.substring(1), 10);
      nextId = `C${(numPart + 1).toString().padStart(4, '0')}`;
    }
  }
  
  return nextId;
};

export const updateCustomer = async (customer: Customer) => {
  const { data, error } = await supabase
    .from('customer')
    .update({
      custname: customer.custname,
      address: customer.address,
      payterm: customer.payterm
    })
    .eq('custno', customer.custno)
    .select();
  
  if (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
  
  return data[0] as Customer;
};

export const deleteCustomer = async (customerId: string) => {
  const { error } = await supabase
    .from('customer')
    .delete()
    .eq('custno', customerId);
  
  if (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
  
  return true;
};
