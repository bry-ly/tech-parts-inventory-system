/**
 * Quantity cell component for inventory table
 * Displays stock status, quantity, and stock adjustment popover
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStockStatus, STOCK_STATUS_BADGES } from "@/lib/constants/inventory";
import { ProductService } from "@/lib/services";
import type { Product } from "@/lib/types";

interface QuantityCellProps {
  product: Product;
}

export function QuantityCell({ product }: QuantityCellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [note, setNote] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const qty = Number(product.quantity || 0);
  const lowThreshold =
    product.lowStockAt == null ? undefined : Number(product.lowStockAt);
  const isLow = typeof lowThreshold === "number" && qty <= lowThreshold;
  const stockStatus = getStockStatus(qty, lowThreshold);
  const statusBadge = STOCK_STATUS_BADGES[stockStatus];

  const handleAdjustment = async () => {
    const adjustment = Number(adjustmentValue);
    if (isNaN(adjustment) || adjustment === 0) {
      return;
    }

    setIsAdjusting(true);
    const result = await ProductService.adjustStock(
      product.id,
      adjustment,
      note
    );
    setIsAdjusting(false);

    if (result.success) {
      setIsOpen(false);
      setAdjustmentValue("");
      setNote("");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {stockStatus !== "in-stock" && (
        <Badge variant="outline" className={`w-fit ${statusBadge.className}`}>
          {statusBadge.label}
        </Badge>
      )}
      <span
        className={`font-semibold text-sm ${
          isLow || qty === 0 ? "text-red-600 dark:text-red-400" : ""
        }`}
      >
        {qty} {qty === 1 ? "unit" : "units"}
      </span>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOpen(false);
            setAdjustmentValue("");
            setNote("");
          } else {
            setIsOpen(true);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            disabled={isAdjusting}
          >
            <IconEdit className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Adjust Stock</h4>
              <p className="text-xs text-muted-foreground">
                Current quantity: {qty}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustment">Adjustment Amount</Label>
              <Input
                id="adjustment"
                type="number"
                placeholder="e.g., +10 or -5"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdjustment();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Use positive numbers to add stock, negative to subtract
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Reason for adjustment..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdjustment}
                disabled={!adjustmentValue || isAdjusting}
                className="flex-1"
              >
                {isAdjusting ? "Adjusting..." : "Adjust"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
