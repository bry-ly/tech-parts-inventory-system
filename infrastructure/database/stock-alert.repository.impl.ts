import { PrismaClient } from "@prisma/client";
import { StockAlert, StockAlertType } from "@/domain/entities/stock-alert.entity";
import { StockAlertRepository } from "@/domain/interfaces/stock-alert.repository";

export class PrismaStockAlertRepository implements StockAlertRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<StockAlert, "id" | "createdAt">): Promise<StockAlert> {
    const alert = await this.prisma.stockAlert.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        type: data.type,
        message: data.message,
        threshold: data.threshold,
        currentValue: data.currentValue,
        acknowledged: data.acknowledged,
        acknowledgedBy: data.acknowledgedBy,
        acknowledgedAt: data.acknowledgedAt,
        resolvedAt: data.resolvedAt,
      },
    });
    return this.mapToEntity(alert);
  }

  async findById(id: string): Promise<StockAlert | null> {
    const alert = await this.prisma.stockAlert.findUnique({
      where: { id },
    });
    return alert ? this.mapToEntity(alert) : null;
  }

  async findByUserId(userId: string, includeAcknowledged: boolean = false): Promise<StockAlert[]> {
    const where: any = { userId };
    if (!includeAcknowledged) {
      where.acknowledged = false;
    }

    const alerts = await this.prisma.stockAlert.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return alerts.map((a) => this.mapToEntity(a));
  }

  async findByType(userId: string, type: StockAlertType): Promise<StockAlert[]> {
    const alerts = await this.prisma.stockAlert.findMany({
      where: { userId, type },
      orderBy: { createdAt: "desc" },
    });
    return alerts.map((a) => this.mapToEntity(a));
  }

  async findByProductId(productId: string): Promise<StockAlert[]> {
    const alerts = await this.prisma.stockAlert.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
    return alerts.map((a) => this.mapToEntity(a));
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<StockAlert> {
    const alert = await this.prisma.stockAlert.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: new Date(),
      },
    });
    return this.mapToEntity(alert);
  }

  async resolve(id: string): Promise<StockAlert> {
    const alert = await this.prisma.stockAlert.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
      },
    });
    return this.mapToEntity(alert);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stockAlert.delete({
      where: { id },
    });
  }

  async getUnacknowledgedCount(userId: string): Promise<number> {
    return await this.prisma.stockAlert.count({
      where: {
        userId,
        acknowledged: false,
      },
    });
  }

  private mapToEntity(alert: any): StockAlert {
    return {
      id: alert.id,
      userId: alert.userId,
      productId: alert.productId,
      type: alert.type as StockAlertType,
      message: alert.message,
      threshold: alert.threshold,
      currentValue: alert.currentValue,
      acknowledged: alert.acknowledged,
      acknowledgedBy: alert.acknowledgedBy,
      acknowledgedAt: alert.acknowledgedAt,
      createdAt: alert.createdAt,
      resolvedAt: alert.resolvedAt,
    };
  }
}

