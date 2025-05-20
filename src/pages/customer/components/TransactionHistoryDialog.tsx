
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Customer } from "@/services/customerService";
import { CustomerTransaction, getCustomerTransactions } from "@/services/transactionService";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface TransactionHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
}

const TransactionHistoryDialog = ({
  isOpen,
  onOpenChange,
  customer,
}: TransactionHistoryDialogProps) => {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<CustomerTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (isOpen && customer?.custno) {
        setLoading(true);
        setError(null);
        try {
          const data = await getCustomerTransactions(customer.custno);
          setTransactions(data);
        } catch (err) {
          console.error("Failed to fetch transactions:", err);
          setError("Failed to load transactions. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTransactions();
  }, [isOpen, customer]);

  const handleViewDetails = (transaction: CustomerTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };
  
  if (!customer) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction History View</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <span className="font-semibold">Customer Number:</span> {customer.custno}
            </div>
            <div>
              <span className="font-semibold">Customer name:</span> {customer.custname}
            </div>
          </div>
          
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4">No transactions found for this customer.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Number</TableHead>
                    <TableHead>Sales Date</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.transno}>
                      <TableCell>{transaction.transno}</TableCell>
                      <TableCell>
                        {transaction.salesdate ? format(new Date(transaction.salesdate), 'dd-MMM-yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>${transaction.totalSales.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="link" 
                          onClick={() => handleViewDetails(transaction)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedTransaction && (
        <TransactionDetailsDialog
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionHistoryDialog;
