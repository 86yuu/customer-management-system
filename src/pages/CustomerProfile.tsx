
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { Customer, getCustomerById, updateCustomer, deleteCustomer } from "@/services/customerService";
import { CustomerTransaction, TransactionDetail, getCustomerTransactions, getTransactionDetails } from "@/services/transactionService";
import TransactionDetailsDialog from "./customer/components/TransactionDetailsDialog";

const paymentTermOptions = ["COD", "30D", "45D"];

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<CustomerTransaction | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Customer>({
    custno: '',
    custname: '',
    address: '',
    payterm: '',
  });

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!user) return;
      
      try {
        // Get customer linked to this user
        const { data, error } = await extendedSupabase
          .from('user_customer_map')
          .select('customer_id')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const customerData = await getCustomerById(data.customer_id);
          setCustomer(customerData);
          setEditForm(customerData || {
            custno: '',
            custname: '',
            address: '',
            payterm: '',
          });
          
          // Load transactions for this customer
          if (customerData) {
            const transactionsData = await getCustomerTransactions(customerData.custno);
            setTransactions(transactionsData);
          }
        }
      } catch (error) {
        console.error("Error loading customer data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomerData();
  }, [user, toast]);
  
  const handleSaveProfile = async () => {
    if (!customer) return;
    
    try {
      const updatedCustomer = await updateCustomer(editForm);
      setCustomer(updatedCustomer);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!customer) return;
    
    try {
      await deleteCustomer(customer.custno);
      // Also delete the user-customer mapping
      if (user) {
        await extendedSupabase
          .from('user_customer_map')
          .delete()
          .eq('user_id', user.id);
      }
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
      
      // Sign out the user
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete your account",
        variant: "destructive",
      });
    }
  };
  
  const viewTransactionDetails = (transaction: CustomerTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
            <CardDescription>
              Your account is not linked to a customer profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">
              Please contact an administrator to link your account to a customer profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your customer information
        </p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Edit your profile information below" 
                      : "View your customer information"}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="custno" className="text-right">
                    Customer ID
                  </Label>
                  <Input
                    id="custno"
                    value={customer.custno}
                    disabled
                    className="col-span-3 bg-muted"
                  />
                </div>
                
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="custname" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="custname"
                        value={editForm.custname || ''}
                        onChange={(e) => setEditForm({ ...editForm, custname: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="payterm" className="text-right">
                        Payment Terms
                      </Label>
                      <div className="col-span-3">
                        <Select 
                          value={editForm.payterm || ''} 
                          onValueChange={(value) => setEditForm({ ...editForm, payterm: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermOptions.map((term) => (
                              <SelectItem key={term} value={term}>
                                {term}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Name</Label>
                      <div className="col-span-3">{customer.custname}</div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Address</Label>
                      <div className="col-span-3">{customer.address}</div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Payment Terms</Label>
                      <div className="col-span-3">{customer.payterm}</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            {isEditing && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditForm(customer);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            )}
          </Card>
          
          <div className="mt-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your customer account and all associated data.
                  This action cannot be undone.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View your past transactions and order details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left font-medium">Transaction #</th>
                          <th className="p-2 text-left font-medium">Date</th>
                          <th className="p-2 text-right font-medium">Amount</th>
                          <th className="p-2 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.transno} className="border-t">
                            <td className="p-2">{transaction.transno}</td>
                            <td className="p-2">
                              {new Date(transaction.salesdate).toLocaleDateString()}
                            </td>
                            <td className="p-2 text-right">
                              ${transaction.totalSales.toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => viewTransactionDetails(transaction)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetailsDialog
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          transaction={selectedTransaction}
        />
      )}
      
      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerProfile;
