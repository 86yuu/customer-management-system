
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CustomerTable from "./components/CustomerTable";
import AddCustomerDialog from "./components/AddCustomerDialog";
import EditCustomerDialog from "./components/EditCustomerDialog";
import SearchCustomerForm from "./components/SearchCustomerForm";
import { useCustomerManagement } from "./hooks/useCustomerManagement";

const ManageCustomer = () => {
  const navigate = useNavigate();
  const {
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
    handleDeleteCustomer
  } = useCustomerManagement();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/manage-customers?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate("/manage-customers");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Customers</h1>
          <p className="text-muted-foreground">Add, edit, or remove customers</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Customer List</CardTitle>
            <SearchCustomerForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CustomerTable
            customers={customers}
            loading={loading}
            searchQuery={searchQuery}
            onEdit={(customer) => {
              setSelectedCustomer(customer);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteCustomer}
            onClearSearch={handleClearSearch}
          />
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <AddCustomerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        nextCustomerId={nextCustomerId}
        newCustomer={newCustomer}
        onCustomerChange={setNewCustomer}
        onAddCustomer={handleAddCustomer}
      />

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedCustomer={selectedCustomer}
        onCustomerChange={setSelectedCustomer}
        onEditCustomer={handleEditCustomer}
      />
    </div>
  );
};

export default ManageCustomer;
