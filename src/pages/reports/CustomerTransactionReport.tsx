
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer, getCustomers } from "@/services/customerService";
import { CustomerTransaction, TransactionDetail, getCustomerTransactions, getTransactionDetails } from "@/services/transactionService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const CustomerTransactionReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive",
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  useEffect(() => {
    const filtered = customers.filter(customer => 
      customer.custname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.custno.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomer(customerId);
    setSelectedTransaction(null);
    setTransactionDetails([]);
    
    if (!customerId) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getCustomerTransactions(customerId);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching customer transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction data",
        variant: "destructive",
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionClick = async (transaction: CustomerTransaction) => {
    if (selectedTransaction === transaction.transno) {
      setSelectedTransaction(null);
      setTransactionDetails([]);
      return;
    }

    setSelectedTransaction(transaction.transno);
    
    try {
      setLoadingDetails(true);
      const details = await getTransactionDetails(transaction.transno, transaction.salesdate);
      setTransactionDetails(details);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction details",
        variant: "destructive",
      });
      setTransactionDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Customer</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {searchQuery && filteredCustomers.length > 0 && (
          <Card className="mt-2">
            <CardContent className="p-2">
              <div className="max-h-48 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <Button
                    key={customer.custno}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleCustomerSelect(customer.custno)}
                  >
                    <div>
                      <div className="font-medium">{customer.custname}</div>
                      <div className="text-sm text-muted-foreground">{customer.custno}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedCustomer && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              {customers.find(c => c.custno === selectedCustomer)?.custname} - Transaction History
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                No transaction records found for this customer
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.transno} className="border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-accent"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div>
                        <div className="font-medium">Transaction #{transaction.transno}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.salesdate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(transaction.totalSales)}</div>
                        </div>
                        {selectedTransaction === transaction.transno ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </Button>
                    
                    {selectedTransaction === transaction.transno && (
                      <div className="px-4 pb-4">
                        <Separator className="my-2" />
                        <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                        {loadingDetails ? (
                          <div className="flex justify-center items-center h-20">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : transactionDetails.length === 0 ? (
                          <div className="text-sm text-center text-muted-foreground py-2">
                            No details available
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactionDetails.map((detail, index) => (
                                <TableRow key={`${detail.prodcode}-${index}`}>
                                  <TableCell className="font-medium">{detail.prodcode}</TableCell>
                                  <TableCell>{detail.description}</TableCell>
                                  <TableCell className="text-right">{detail.quantity}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(detail.unitprice)}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(detail.subtotal)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-medium">
                                  Total:
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(
                                    transactionDetails.reduce((sum, item) => sum + item.subtotal, 0)
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
