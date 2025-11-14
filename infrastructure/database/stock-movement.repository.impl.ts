import { PrismaClient } from "@prisma/client";
import { StockMovement, StockMovementType } from "@/domain/entities/stock-movement.entity";
import { StockMovementRepository } from "@/domain/interfaces/stock-movement.repository";

export class PrismaStockMovementRepository implements StockMovementRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<StockMovement, "id" | "createdAt">): Promise<StockMovement> {
    const movement = await this.prisma.stockMovement.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        supplierId: data.supplierId,
        batchId: data.batchId,
        type: data.type,
        quantity: data.quantity,
        previousQty: data.previousQty,
        newQty: data.newQty,
        unitCost: data.unitCost,
        totalCost: data.totalCost,
        reference: data.reference,
        reason: data.reason,
        notes: data.notes,
        performedBy: data.performedBy,
      },
    });
    return this.mapToEntity(movement);
  }

  async findById(id: string): Promise<StockMovement | null> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
    });
    return movement ? this.mapToEntity(movement) : null;
  }

  async findByUserId(userId: string, limit: number = 100): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return movements.map((m) => this.mapToEntity(m));
  }

  async findByProductId(productId: string, limit: number = 50): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return movements.map((m) => this.mapToEntity(m));
  }

  async findByType(userId: string, type: StockMovementType, limit: number = 100): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { userId, type },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return movements.map((m) => this.mapToEntity(m));
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return movements.map((m) => this.mapToEntity(m));
  }

  async getTotalsByType(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<StockMovementType, number>> {
    const where: any = { userId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const movements = await this.prisma.stockMovement.groupBy({
      by: ["type"],
      where,
      _sum: {
        quantity: true,
      },
    });

    const totals: Record<StockMovementType, number> = {
      IN: 0,
      OUT: 0,
      ADJUSTMENT: 0,
      RETURN: 0,
    };

    movements.forEach((m) => {
      totals[m.type as StockMovementType] = m._sum.quantity || 0;
    });

    return totals;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stockMovement.delete({
      where: { id },
    });
  }

  private mapToEntity(movement: any): StockMovement {
    return {
      id: movement.id,
      userId: movement.userId,
      productId: movement.productId,
      supplierId: movement.supplierId,
      batchId: movement.batchId,
      type: movement.type as StockMovementType,
      quantity: movement.quantity,
      previousQty: movement.previousQty,
      newQty: movement.newQty,
      unitCost: movement.unitCost ? Number(movement.unitCost) : null,
      totalCost: movement.totalCost ? Number(movement.totalCost) : null,
      reference: movement.reference,
      reason: movement.reason,
      notes: movement.notes,
      performedBy: movement.performedBy,
      createdAt: movement.createdAt,
    };
  }
}

