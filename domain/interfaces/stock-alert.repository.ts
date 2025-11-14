import { StockAlert, StockAlertType } from "../entities/stock-alert.entity";

export interface StockAlertRepository {
  create(data: Omit<StockAlert, "id" | "createdAt">): Promise<StockAlert>;
  findById(id: string): Promise<StockAlert | null>;
  findByUserId(userId: string, includeAcknowledged?: boolean): Promise<StockAlert[]>;
  findByType(userId: string, type: StockAlertType): Promise<StockAlert[]>;
  findByProductId(productId: string): Promise<StockAlert[]>;
  acknowledge(id: string, acknowledgedBy: string): Promise<StockAlert>;
  resolve(id: string): Promise<StockAlert>;
  delete(id: string): Promise<void>;
  getUnacknowledgedCount(userId: string): Promise<number>;
}



