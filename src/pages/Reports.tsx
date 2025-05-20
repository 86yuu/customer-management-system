
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Users } from "lucide-react";
import { CustomerPrintReport } from "@/pages/reports/CustomerPrintReport";
import { CustomerTransactionReport } from "@/pages/reports/CustomerTransactionReport";
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [activeReport, setActiveReport] = useState<"none" | "customer" | "transactions">("none");
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      if (!printRef.current) {
        toast({
          title: "Error",
          description: "No content to print",
          variant: "destructive",
        });
        return Promise.reject("No content to print");
      }
      return Promise.resolve();
    },
    onPrintError: () => {
      toast({
        title: "Error",
        description: "Failed to print the report",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and print reports for your business
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Select a report type to generate and print
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setActiveReport("customer")}
            >
              <Users className="h-4 w-4" />
              <span>Customer Details Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setActiveReport("transactions")}
            >
              <FileText className="h-4 w-4" />
              <span>Customer Transactions Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeReport !== "none" && (
        <>
          <Separator className="my-6" />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {activeReport === "customer" 
                    ? "Customer Details Report" 
                    : "Customer Transactions Report"}
                </CardTitle>
                <CardDescription>
                  {activeReport === "customer"
                    ? "View and print details for all customers"
                    : "View and print transaction history for customers"}
                </CardDescription>
              </div>
              <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>Print Report</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div ref={printRef}>
                {activeReport === "customer" ? (
                  <CustomerPrintReport />
                ) : (
                  <CustomerTransactionReport />
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;
