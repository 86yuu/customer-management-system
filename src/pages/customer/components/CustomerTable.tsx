
import React from "react";
import { Customer } from "@/services/customerService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  searchQuery: string;
  onEdit: (customer: Customer) => void;
  onDelete: (custno: string) => void;
  onClearSearch: () => void;
}

const CustomerTable = ({
  customers,
  loading,
  searchQuery,
  onEdit,
  onDelete,
  onClearSearch,
}: CustomerTableProps) => {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `No customers found matching "${searchQuery}"`
            : "No customers found. Add your first customer to get started."}
        </p>
        {searchQuery && (
          <Button variant="link" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.custno}>
              <TableCell className="font-medium">{customer.custno}</TableCell>
              <TableCell>{customer.custname}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.payterm}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${customer.custname}?`)) {
                        onDelete(customer.custno);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
