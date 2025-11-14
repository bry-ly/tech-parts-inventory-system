// Domain entity for Stock Alert
export interface StockAlert {
  id: string;
  userId: string;
  productId: string;
  type: StockAlertType;
  message: string;
  threshold: number | null;
  currentValue: number | null;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: Date | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export type StockAlertType = "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRING_SOON" | "EXPIRED";

export const StockAlertTypes: Record<StockAlertType, string> = {
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
};



