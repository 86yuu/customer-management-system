
import { supabase } from "@/integrations/supabase/client";

export interface CustomerTransaction {
  transno: string;
  salesdate: string;
  totalSales: number;
}

export interface TransactionDetail {
  prodcode: string;
  description: string;
  quantity: number;
  unitprice: number;
  subtotal: number;
}

export const getCustomerTransactions = async (custno: string): Promise<CustomerTransaction[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      transno,
      salesdate
    `)
    .eq('custno', custno)
    .order('salesdate', { ascending: false });
  
  if (error) {
    console.error("Error fetching customer transactions:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Create transaction objects
  const transactions: CustomerTransaction[] = data.map((sale) => ({
    transno: sale.transno,
    salesdate: sale.salesdate,
    totalSales: 0 // We'll calculate this in the next step
  }));

  // Calculate total sales for each transaction
  for (const transaction of transactions) {
    const { data: details } = await supabase
      .from('salesdetail')
      .select(`
        quantity,
        prodcode
      `)
      .eq('transno', transaction.transno);
    
    if (details && Array.isArray(details)) {
      let total = 0;
      
      for (const detail of details) {
        const { data: priceData } = await supabase
          .from('pricehist')
          .select('unitprice')
          .eq('prodcode', detail.prodcode)
          .lte('effdate', transaction.salesdate)
          .order('effdate', { ascending: false })
          .limit(1);
        
        const unitPrice = priceData && priceData.length > 0 ? priceData[0].unitprice : 0;
        total += (detail.quantity || 0) * unitPrice;
      }
      
      transaction.totalSales = total;
    }
  }
  
  return transactions;
};

export const getTransactionDetails = async (transno: string, salesdate: string): Promise<TransactionDetail[]> => {
  const { data: details, error } = await supabase
    .from('salesdetail')
    .select(`
      quantity,
      prodcode,
      product(description)
    `)
    .eq('transno', transno);
  
  if (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }

  const result: TransactionDetail[] = [];
  
  if (details && Array.isArray(details)) {
    for (const detail of details) {
      const { data: priceData } = await supabase
        .from('pricehist')
        .select('unitprice')
        .eq('prodcode', detail.prodcode)
        .lte('effdate', salesdate)
        .order('effdate', { ascending: false })
        .limit(1);
      
      const unitPrice = priceData && priceData.length > 0 ? priceData[0].unitprice : 0;
      const quantity = detail.quantity || 0;
      
      result.push({
        prodcode: detail.prodcode,
        description: detail.product ? detail.product.description : '',
        quantity: quantity,
        unitprice: unitPrice,
        subtotal: quantity * unitPrice
      });
    }
  }
  
  return result;
};
