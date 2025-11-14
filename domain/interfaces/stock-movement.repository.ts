import { StockMovement, StockMovementType } from "../entities/stock-movement.entity";

export interface StockMovementRepository {
  create(data: Omit<StockMovement, "id" | "createdAt">): Promise<StockMovement>;
  findById(id: string): Promise<StockMovement | null>;
  findByUserId(userId: string, limit?: number): Promise<StockMovement[]>;
  findByProductId(productId: string, limit?: number): Promise<StockMovement[]>;
  findByType(userId: string, type: StockMovementType, limit?: number): Promise<StockMovement[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<StockMovement[]>;
  getTotalsByType(userId: string, startDate?: Date, endDate?: Date): Promise<Record<StockMovementType, number>>;
  delete(id: string): Promise<void>;
}



