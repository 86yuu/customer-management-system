
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCustomers, getNextCustomerId, Customer } from "@/services/customerService";
import { supabase } from "@/integrations/supabase/client";

export const useCustomerManagement = (initialSearchQuery = "") => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    custno: "",
    custname: "",
    address: "",
    payterm: ""
  });
  const [nextCustomerId, setNextCustomerId] = useState("");
  const { toast } = useToast();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers(searchQuery);
      setCustomers(data);
    } catch (error) {
      toast({
        title: "Error loading customers",
        description: "Failed to load customers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  const handleOpenAddDialog = async () => {
    try {
      const nextId = await getNextCustomerId();
      setNextCustomerId(nextId);
      setNewCustomer({
        custno: nextId,
        custname: "",
        address: "",
        payterm: ""
      });
      setIsAddDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate customer ID. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomer = async () => {
    try {
      if (!newCustomer.custname) {
        toast({
          title: "Missing information",
          description: "Customer Name is required",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('customer')
        .insert([newCustomer]);

      if (error) throw error;

      toast({
        title: "Customer added",
        description: "Customer has been successfully added",
      });

      setIsAddDialogOpen(false);
      setNewCustomer({
        custno: "",
        custname: "",
        address: "",
        payterm: ""
      });

      // Reload customers list
      loadCustomers();
    } catch (error: any) {
      toast({
        title: "Error adding customer",
        description: error.message || "Failed to add customer",
        variant: "destructive"
      });
    }
  };

  const handleEditCustomer = async () => {
    try {
      if (!selectedCustomer || !selectedCustomer.custname) {
        toast({
          title: "Missing information",
          description: "Customer Name is required",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('customer')
        .update({
          custname: selectedCustomer.custname,
          address: selectedCustomer.address,
          payterm: selectedCustomer.payterm
        })
        .eq('custno', selectedCustomer.custno);

      if (error) throw error;

      toast({
        title: "Customer updated",
        description: "Customer has been successfully updated",
      });

      setIsEditDialogOpen(false);
      
      // Reload customers list
      loadCustomers();
    } catch (error: any) {
      toast({
        title: "Error updating customer",
        description: error.message || "Failed to update customer",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomer = async (custno: string) => {
    try {
      const { error } = await supabase
        .from('customer')
        .delete()
        .eq('custno', custno);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "Customer has been successfully deleted",
      });

      // Reload customers list
      loadCustomers();
    } catch (error: any) {
      toast({
        title: "Error deleting customer",
        description: error.message || "Failed to delete customer",
        variant: "destructive"
      });
    }
  };

  return {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    nextCustomerId,
    handleOpenAddDialog,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    loadCustomers
  };
};
