import { Product } from "@/domain/entities/product.entity";
import { Supplier } from "@/domain/entities/supplier.entity";
import { StockMovement } from "@/domain/entities/stock-movement.entity";

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  // Get headers
  const keys = Object.keys(data[0]) as (keyof T)[];
  const headerRow = headers
    ? keys.map((key) => headers[key] || String(key)).join(",")
    : keys.join(",");

  // Convert data to CSV rows
  const rows = data.map((item) => {
    return keys
      .map((key) => {
        const value = item[key];
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        // Handle dates
        if (value instanceof Date) return value.toISOString();
        // Handle strings with commas or quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      })
      .join(",");
  });

  // Combine header and rows
  const csv = [headerRow, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportProductsToCSV(products: Product[]): void {
  const headers: Record<keyof Product, string> = {
    id: "ID",
    userId: "User ID",
    categoryId: "Category ID",
    name: "Product Name",
    manufacturer: "Manufacturer",
    model: "Model",
    sku: "SKU",
    quantity: "Quantity",
    lowStockAt: "Low Stock Threshold",
    condition: "Condition",
    location: "Location",
    price: "Price",
    specs: "Specifications",
    compatibility: "Compatibility",
    supplier: "Supplier",
    warrantyMonths: "Warranty (Months)",
    notes: "Notes",
    imageUrl: "Image URL",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  exportToCSV(products, `inventory-${new Date().toISOString().split("T")[0]}.csv`, headers);
}

export function exportSuppliersToCSV(suppliers: Supplier[]): void {
  const headers: Record<keyof Supplier, string> = {
    id: "ID",
    userId: "User ID",
    name: "Supplier Name",
    contactPerson: "Contact Person",
    email: "Email",
    phone: "Phone",
    address: "Address",
    website: "Website",
    notes: "Notes",
    active: "Active",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  exportToCSV(suppliers, `suppliers-${new Date().toISOString().split("T")[0]}.csv`, headers);
}

export function exportStockMovementsToCSV(movements: StockMovement[]): void {
  const headers: Record<keyof StockMovement, string> = {
    id: "ID",
    userId: "User ID",
    productId: "Product ID",
    supplierId: "Supplier ID",
    batchId: "Batch ID",
    type: "Movement Type",
    quantity: "Quantity",
    previousQty: "Previous Quantity",
    newQty: "New Quantity",
    unitCost: "Unit Cost",
    totalCost: "Total Cost",
    reference: "Reference",
    reason: "Reason",
    notes: "Notes",
    performedBy: "Performed By",
    createdAt: "Date",
  };

  exportToCSV(
    movements,
    `stock-movements-${new Date().toISOString().split("T")[0]}.csv`,
    headers
  );
}



