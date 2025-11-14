// Domain entity for Stock Movement
export interface StockMovement {
  id: string;
  userId: string;
  productId: string;
  supplierId: string | null;
  batchId: string | null;
  type: StockMovementType;
  quantity: number;
  previousQty: number;
  newQty: number;
  unitCost: number | null;
  totalCost: number | null;
  reference: string | null;
  reason: string | null;
  notes: string | null;
  performedBy: string;
  createdAt: Date;
}

export type StockMovementType = "IN" | "OUT" | "ADJUSTMENT" | "RETURN";

export const StockMovementTypes: Record<StockMovementType, string> = {
  IN: "Stock In",
  OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
  RETURN: "Return",
};



