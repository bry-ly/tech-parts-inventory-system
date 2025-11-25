"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Type for serialized sale data (from server action)
type SerializedSale = {
  id: string;
  userId: string;
  invoiceNumber: string;
  customer: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    saleId: string;
    productId: string | null;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
    totalPrice: number;
  }[];
};

interface RecentSalesTableProps {
  sales: SerializedSale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {format(new Date(sale.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{sale.customer || "Walk-in Customer"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₱{Number(sale.totalAmount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No recent sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
