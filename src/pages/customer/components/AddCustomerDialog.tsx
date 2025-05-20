
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/services/customerService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nextCustomerId: string;
  newCustomer: Customer;
  onCustomerChange: (customer: Customer) => void;
  onAddCustomer: () => void;
}

const paymentTermOptions = ["COD", "30D", "45D"];

const AddCustomerDialog = ({
  isOpen,
  onOpenChange,
  nextCustomerId,
  newCustomer,
  onCustomerChange,
  onAddCustomer,
}: AddCustomerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter customer details below to add a new customer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custno" className="text-right">
              Customer ID
            </Label>
            <Input
              id="custno"
              value={nextCustomerId}
              disabled
              className="col-span-3 bg-muted"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custname" className="text-right">
              Customer Name
            </Label>
            <Input
              id="custname"
              value={newCustomer.custname || ''}
              onChange={(e) =>
                onCustomerChange({ ...newCustomer, custname: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={newCustomer.address || ''}
              onChange={(e) =>
                onCustomerChange({ ...newCustomer, address: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payterm" className="text-right">
              Payment Terms
            </Label>
            <Select 
              value={newCustomer.payterm || ''} 
              onValueChange={(value) => onCustomerChange({ ...newCustomer, payterm: value })}
            >
              <SelectTrigger className="col-span-3">
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddCustomer}>Add Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
