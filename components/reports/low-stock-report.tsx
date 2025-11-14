"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLowStockProducts, getOutOfStockProducts } from "@/application/actions/inventory-analytics.actions";
import { toast } from "sonner";

export function LowStockReport() {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [outOfStock, setOutOfStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [lowStockResult, outOfStockResult] = await Promise.all([
        getLowStockProducts(),
        getOutOfStockProducts(),
      ]);

      if (lowStockResult.error) {
        toast.error(lowStockResult.error);
      } else {
        setLowStock(lowStockResult.data || []);
      }

      if (outOfStockResult.error) {
        toast.error(outOfStockResult.error);
      } else {
        setOutOfStock(outOfStockResult.data || []);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div>Loading report...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Out of Stock Products</CardTitle>
          <CardDescription>Products that need immediate restocking</CardDescription>
        </CardHeader>
        <CardContent>
          {outOfStock.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No out of stock products
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outOfStock.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell>{product.location || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Out of Stock</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
          <CardDescription>Products below their low stock threshold</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStock.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No low stock products
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Qty</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.lowStockAt}</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell>
                      <Badge variant="default">Low Stock</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



