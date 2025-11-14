// Domain entity for Batch
export interface Batch {
  id: string;
  userId: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  manufacturedAt: Date | null;
  expiresAt: Date | null;
  receivedAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}



