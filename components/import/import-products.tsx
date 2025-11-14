"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { csvToObjects, validateProductImport } from "@/lib/utils/import";
import { toast } from "sonner";
import { IconUpload, IconDownload } from "@tabler/icons-react";

export function ImportProducts() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  }

  async function handleImport() {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      const text = await file.text();
      const { data } = csvToObjects(text);

      const successList: any[] = [];
      const errorList: any[] = [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const validation = validateProductImport(item);

        if (validation.valid) {
          // In a real implementation, you would call your API here
          // For now, we'll just validate
          successList.push(item);
        } else {
          errorList.push({
            row: i + 2, // +2 because of header row and 0-index
            errors: validation.errors,
            data: item,
          });
        }

        setProgress(Math.round(((i + 1) / data.length) * 100));
      }

      setResults({
        total: data.length,
        success: successList.length,
        errors: errorList.length,
        errorDetails: errorList,
      });

      if (errorList.length === 0) {
        toast.success(`Successfully validated ${successList.length} products`);
      } else {
        toast.warning(`${successList.length} valid, ${errorList.length} errors`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to import file");
    }

    setImporting(false);
  }

  function downloadTemplate() {
    const template = [
      [
        "name",
        "manufacturer",
        "model",
        "sku",
        "quantity",
        "lowStockAt",
        "condition",
        "location",
        "price",
        "specs",
        "supplier",
        "warrantyMonths",
        "notes",
      ].join(","),
      [
        "Sample Product",
        "Sample Manufacturer",
        "Model X",
        "SKU-001",
        "100",
        "20",
        "new",
        "Warehouse A",
        "99.99",
        "Sample specifications",
        "Sample Supplier",
        "12",
        "Sample notes",
      ].join(","),
    ].join("\n");

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-import-template.csv";
    link.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Products</CardTitle>
        <CardDescription>
          Upload a CSV file to bulk import products into your inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <IconDownload size={16} className="mr-2" />
            Download Template
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Select CSV File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
        </div>

        {file && (
          <Alert>
            <AlertDescription>
              Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </AlertDescription>
          </Alert>
        )}

        {importing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">{progress}% complete</p>
          </div>
        )}

        {results && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Import Results:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Total rows: {results.total}</li>
                  <li className="text-green-600">Valid: {results.success}</li>
                  <li className="text-red-600">Errors: {results.errors}</li>
                </ul>
                {results.errorDetails && results.errorDetails.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Error Details:</p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {results.errorDetails.map((error: any, idx: number) => (
                        <div key={idx} className="text-sm border-l-2 border-red-500 pl-2">
                          <p className="font-medium">Row {error.row}:</p>
                          <ul className="list-disc list-inside ml-2">
                            {error.errors.map((err: string, errIdx: number) => (
                              <li key={errIdx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleImport} disabled={!file || importing}>
          <IconUpload size={16} className="mr-2" />
          {importing ? "Importing..." : "Import Products"}
        </Button>
      </CardContent>
    </Card>
  );
}



