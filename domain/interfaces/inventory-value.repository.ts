import { InventoryValue } from "../entities/inventory-value.entity";

export interface InventoryValueRepository {
  create(data: Omit<InventoryValue, "id" | "snapshotDate">): Promise<InventoryValue>;
  findByUserId(userId: string, limit?: number): Promise<InventoryValue[]>;
  findLatest(userId: string): Promise<InventoryValue | null>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<InventoryValue[]>;
  calculateCurrent(userId: string): Promise<Omit<InventoryValue, "id" | "snapshotDate" | "userId">>;
}



