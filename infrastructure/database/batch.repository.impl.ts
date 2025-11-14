import { PrismaClient } from "@prisma/client";
import { Batch } from "@/domain/entities/batch.entity";
import { BatchRepository } from "@/domain/interfaces/batch.repository";

export class PrismaBatchRepository implements BatchRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Batch, "id" | "createdAt" | "updatedAt">): Promise<Batch> {
    const batch = await this.prisma.batch.create({
      data,
    });
    return this.mapToEntity(batch);
  }

  async findById(id: string): Promise<Batch | null> {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
    });
    return batch ? this.mapToEntity(batch) : null;
  }

  async findByProductId(productId: string): Promise<Batch[]> {
    const batches = await this.prisma.batch.findMany({
      where: { productId },
      orderBy: { receivedAt: "desc" },
    });
    return batches.map((b) => this.mapToEntity(b));
  }

  async findExpiringBatches(userId: string, daysThreshold: number): Promise<Batch[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const batches = await this.prisma.batch.findMany({
      where: {
        userId,
        expiresAt: {
          lte: thresholdDate,
          gte: new Date(),
        },
      },
      orderBy: { expiresAt: "asc" },
    });
    return batches.map((b) => this.mapToEntity(b));
  }

  async findExpiredBatches(userId: string): Promise<Batch[]> {
    const batches = await this.prisma.batch.findMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(),
        },
      },
      orderBy: { expiresAt: "desc" },
    });
    return batches.map((b) => this.mapToEntity(b));
  }

  async update(id: string, data: Partial<Batch>): Promise<Batch> {
    const batch = await this.prisma.batch.update({
      where: { id },
      data,
    });
    return this.mapToEntity(batch);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.batch.delete({
      where: { id },
    });
  }

  private mapToEntity(batch: any): Batch {
    return {
      id: batch.id,
      userId: batch.userId,
      productId: batch.productId,
      batchNumber: batch.batchNumber,
      quantity: batch.quantity,
      manufacturedAt: batch.manufacturedAt,
      expiresAt: batch.expiresAt,
      receivedAt: batch.receivedAt,
      notes: batch.notes,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }
}

