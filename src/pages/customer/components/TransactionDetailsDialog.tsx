
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
import { CustomerTransaction, TransactionDetail, getTransactionDetails } from "@/services/transactionService";

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: CustomerTransaction;
}

const TransactionDetailsDialog = ({
  isOpen,
  onOpenChange,
  transaction,
}: TransactionDetailsDialogProps) => {
  const [details, setDetails] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (isOpen && transaction) {
        setLoading(true);
        setError(null);
        try {
          const data = await getTransactionDetails(transaction.transno, transaction.salesdate);
          setDetails(data);
        } catch (err) {
          console.error("Failed to fetch transaction details:", err);
          setError("Failed to load transaction details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDetails();
  }, [isOpen, transaction]);
  
  if (!transaction) return null;

  const totalAmount = details.reduce((total, item) => total + item.subtotal, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Detail: {transaction.transno}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : details.length === 0 ? (
          <div className="text-center py-4">No details found for this transaction.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.prodcode}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitprice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-bold">Total:</TableCell>
                  <TableCell className="text-right font-bold">${totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
