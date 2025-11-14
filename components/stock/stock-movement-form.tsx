"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createStockMovement } from "@/application/actions/stock-movement.actions";
import { getActiveSuppliers } from "@/application/actions/supplier.actions";
import { Supplier } from "@/domain/entities/supplier.entity";
import { toast } from "sonner";

interface StockMovementFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export function StockMovementForm({ productId, onSuccess }: StockMovementFormProps) {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [movementType, setMovementType] = useState<string>("IN");

  useEffect(() => {
    async function loadSuppliers() {
      const result = await getActiveSuppliers();
      if (result.data) {
        setSuppliers(result.data);
      }
    }
    loadSuppliers();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (productId) {
      formData.set("productId", productId);
    }

    const result = await createStockMovement(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Stock movement recorded successfully!");
      e.currentTarget.reset();
      onSuccess?.();
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Stock Movement</CardTitle>
        <CardDescription>Track inventory changes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!productId && (
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID *</Label>
              <Input id="productId" name="productId" required placeholder="Enter product ID" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Movement Type *</Label>
              <Select name="type" required onValueChange={setMovementType} defaultValue="IN">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Stock In</SelectItem>
                  <SelectItem value="OUT">Stock Out</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="RETURN">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
                placeholder="Enter quantity"
              />
            </div>

            {(movementType === "IN" || movementType === "RETURN") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Supplier</Label>
                  <Select name="supplierId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">Unit Cost</Label>
                  <Input
                    id="unitCost"
                    name="unitCost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" name="reference" placeholder="PO#, Invoice#, etc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" name="reason" placeholder="Reason for movement" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Additional notes" rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Movement"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



