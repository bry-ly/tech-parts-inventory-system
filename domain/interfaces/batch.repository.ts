import { Batch } from "../entities/batch.entity";

export interface BatchRepository {
  create(data: Omit<Batch, "id" | "createdAt" | "updatedAt">): Promise<Batch>;
  findById(id: string): Promise<Batch | null>;
  findByProductId(productId: string): Promise<Batch[]>;
  findExpiringBatches(userId: string, daysThreshold: number): Promise<Batch[]>;
  findExpiredBatches(userId: string): Promise<Batch[]>;
  update(id: string, data: Partial<Batch>): Promise<Batch>;
  delete(id: string): Promise<void>;
}



