"use client";

import { useState, useEffect } from "react";
import { StockMovementForm } from "@/components/stock/stock-movement-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStockMovements } from "@/application/actions/stock-movement.actions";
import { StockMovement } from "@/domain/entities/stock-movement.entity";
import { toast } from "sonner";

export function StockMovementsClient() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMovements() {
    setLoading(true);
    const result = await getStockMovements(50);
    if (result.error) {
      toast.error(result.error);
    } else {
      setMovements(result.data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMovements();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "IN":
        return "default";
      case "OUT":
        return "destructive";
      case "RETURN":
        return "default";
      case "ADJUSTMENT":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTypeSign = (type: string) => {
    switch (type) {
      case "IN":
      case "RETURN":
        return "+";
      case "OUT":
        return "-";
      case "ADJUSTMENT":
        return "±";
      default:
        return "";
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
        <p className="text-muted-foreground">
          Track and manage all inventory transactions
        </p>
      </div>

      <div className="grid gap-8">
        <StockMovementForm onSuccess={loadMovements} />

        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading movements...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Previous Qty</TableHead>
                    <TableHead>New Qty</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No movements found
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">
                          {new Date(movement.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {movement.productId.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(movement.type) as any}>
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className={movement.type === "OUT" ? "text-red-600" : "text-green-600"}>
                            {getTypeSign(movement.type)}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.previousQty}</TableCell>
                        <TableCell className="font-medium">{movement.newQty}</TableCell>
                        <TableCell className="text-sm">{movement.reference || "-"}</TableCell>
                        <TableCell className="text-sm">{movement.reason || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}



