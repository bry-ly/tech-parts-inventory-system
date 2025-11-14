import { BatchRepository } from "@/domain/interfaces/batch.repository";
import { Batch } from "@/domain/entities/batch.entity";
import { StockAlertRepository } from "@/domain/interfaces/stock-alert.repository";
import { CreateBatchDTO, UpdateBatchDTO } from "../dto/batch.dto";

export class BatchUseCase {
  constructor(
    private batchRepository: BatchRepository,
    private stockAlertRepository: StockAlertRepository
  ) {}

  async createBatch(userId: string, data: CreateBatchDTO): Promise<Batch> {
    const batch = await this.batchRepository.create({
      userId,
      ...data,
    });

    // Check if batch is expiring soon (within 30 days)
    if (data.expiresAt) {
      const daysUntilExpiry = Math.floor(
        (data.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        await this.stockAlertRepository.create({
          userId,
          productId: data.productId,
          type: "EXPIRING_SOON",
          message: `Batch ${data.batchNumber} expires in ${daysUntilExpiry} days`,
          threshold: null,
          currentValue: daysUntilExpiry,
          acknowledged: false,
          acknowledgedBy: null,
          acknowledgedAt: null,
          resolvedAt: null,
        });
      } else if (daysUntilExpiry <= 0) {
        await this.stockAlertRepository.create({
          userId,
          productId: data.productId,
          type: "EXPIRED",
          message: `Batch ${data.batchNumber} has expired`,
          threshold: null,
          currentValue: 0,
          acknowledged: false,
          acknowledgedBy: null,
          acknowledgedAt: null,
          resolvedAt: null,
        });
      }
    }

    return batch;
  }

  async getBatch(id: string): Promise<Batch | null> {
    return await this.batchRepository.findById(id);
  }

  async getProductBatches(productId: string): Promise<Batch[]> {
    return await this.batchRepository.findByProductId(productId);
  }

  async getExpiringBatches(userId: string, daysThreshold: number = 30): Promise<Batch[]> {
    return await this.batchRepository.findExpiringBatches(userId, daysThreshold);
  }

  async getExpiredBatches(userId: string): Promise<Batch[]> {
    return await this.batchRepository.findExpiredBatches(userId);
  }

  async updateBatch(id: string, data: UpdateBatchDTO): Promise<Batch> {
    return await this.batchRepository.update(id, data);
  }

  async deleteBatch(id: string): Promise<void> {
    await this.batchRepository.delete(id);
  }

  async checkExpiringBatches(userId: string): Promise<void> {
    const expiringBatches = await this.getExpiringBatches(userId, 30);
    const expiredBatches = await this.getExpiredBatches(userId);

    // Create alerts for expiring batches
    for (const batch of expiringBatches) {
      const daysUntilExpiry = Math.floor(
        ((batch.expiresAt?.getTime() || 0) - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      await this.stockAlertRepository.create({
        userId,
        productId: batch.productId,
        type: "EXPIRING_SOON",
        message: `Batch ${batch.batchNumber} expires in ${daysUntilExpiry} days`,
        threshold: null,
        currentValue: daysUntilExpiry,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolvedAt: null,
      });
    }

    // Create alerts for expired batches
    for (const batch of expiredBatches) {
      await this.stockAlertRepository.create({
        userId,
        productId: batch.productId,
        type: "EXPIRED",
        message: `Batch ${batch.batchNumber} has expired`,
        threshold: null,
        currentValue: 0,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolvedAt: null,
      });
    }
  }
}



