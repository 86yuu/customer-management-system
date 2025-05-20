
import React, { useState } from "react";
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
import { FileText } from "lucide-react"; 
import { Customer } from "@/services/customerService";
import TransactionHistoryDialog from "./TransactionHistoryDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: Customer | null;
  onCustomerChange: (customer: Customer) => void;
  onEditCustomer: () => void;
}

const paymentTermOptions = ["COD", "30D", "45D"];

const EditCustomerDialog = ({
  isOpen,
  onOpenChange,
  selectedCustomer,
  onCustomerChange,
  onEditCustomer,
}: EditCustomerDialogProps) => {
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);
  
  if (!selectedCustomer) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-custno" className="text-right">
                Customer ID
              </Label>
              <Input
                id="edit-custno"
                value={selectedCustomer.custno}
                disabled
                className="col-span-3 bg-muted"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-custname" className="text-right">
                Customer Name
              </Label>
              <Input
                id="edit-custname"
                value={selectedCustomer.custname || ''}
                onChange={(e) =>
                  onCustomerChange({
                    ...selectedCustomer,
                    custname: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Input
                id="edit-address"
                value={selectedCustomer.address || ''}
                onChange={(e) =>
                  onCustomerChange({
                    ...selectedCustomer,
                    address: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-payterm" className="text-right">
                Payment Terms
              </Label>
              <Select 
                value={selectedCustomer.payterm || ''} 
                onValueChange={(value) => onCustomerChange({ ...selectedCustomer, payterm: value })}
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
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTransactionHistoryOpen(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Transactions
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={onEditCustomer}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <TransactionHistoryDialog
        isOpen={isTransactionHistoryOpen}
        onOpenChange={setIsTransactionHistoryOpen}
        customer={selectedCustomer}
      />
    </>
  );
};

export default EditCustomerDialog;
