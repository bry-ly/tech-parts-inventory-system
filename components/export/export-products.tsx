"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { exportProductsToCSV, exportSuppliersToCSV } from "@/lib/utils/export";
import { getAllSuppliers } from "@/application/actions/supplier.actions";
import { toast } from "sonner";
import { IconDownload } from "@tabler/icons-react";

export function ExportData() {
  const [exportType, setExportType] = useState<"products" | "suppliers">("products");
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      if (exportType === "products") {
        // In a real implementation, you would fetch products from your API
        toast.info("Product export feature - integrate with your product API");
      } else if (exportType === "suppliers") {
        const result = await getAllSuppliers();
        if (result.error) {
          toast.error(result.error);
        } else {
          exportSuppliersToCSV(result.data || []);
          toast.success("Suppliers exported successfully");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download your inventory data as CSV files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Select Data to Export</Label>
          <RadioGroup value={exportType} onValueChange={(v) => setExportType(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="products" id="products" />
              <Label htmlFor="products">Products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="suppliers" id="suppliers" />
              <Label htmlFor="suppliers">Suppliers</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleExport} disabled={loading}>
          <IconDownload size={16} className="mr-2" />
          {loading ? "Exporting..." : "Export to CSV"}
        </Button>
      </CardContent>
    </Card>
  );
}



