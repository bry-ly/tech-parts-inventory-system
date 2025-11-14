"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopProducts } from "@/application/actions/inventory-analytics.actions";
import { toast } from "sonner";

export function TopProductsReport() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await getTopProducts(20);

      if (result.error) {
        toast.error(result.error);
      } else {
        setProducts(result.data || []);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div>Loading report...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Value</CardTitle>
        <CardDescription>Products ranked by total inventory value</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No products found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.manufacturer}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell className="font-bold">
                    ${product.totalValue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}



