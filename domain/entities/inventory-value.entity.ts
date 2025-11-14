// Domain entity for Inventory Value
export interface InventoryValue {
  id: string;
  userId: string;
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  snapshotDate: Date;
}



