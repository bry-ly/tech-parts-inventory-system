import { PrismaClient } from "@prisma/client";
import { InventoryValue } from "@/domain/entities/inventory-value.entity";
import { InventoryValueRepository } from "@/domain/interfaces/inventory-value.repository";

export class PrismaInventoryValueRepository implements InventoryValueRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<InventoryValue, "id" | "snapshotDate">): Promise<InventoryValue> {
    const snapshot = await this.prisma.inventoryValue.create({
      data: {
        userId: data.userId,
        totalProducts: data.totalProducts,
        totalQuantity: data.totalQuantity,
        totalValue: data.totalValue,
        lowStockCount: data.lowStockCount,
        outOfStockCount: data.outOfStockCount,
      },
    });
    return this.mapToEntity(snapshot);
  }

  async findByUserId(userId: string, limit: number = 30): Promise<InventoryValue[]> {
    const snapshots = await this.prisma.inventoryValue.findMany({
      where: { userId },
      orderBy: { snapshotDate: "desc" },
      take: limit,
    });
    return snapshots.map((s) => this.mapToEntity(s));
  }

  async findLatest(userId: string): Promise<InventoryValue | null> {
    const snapshot = await this.prisma.inventoryValue.findFirst({
      where: { userId },
      orderBy: { snapshotDate: "desc" },
    });
    return snapshot ? this.mapToEntity(snapshot) : null;
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<InventoryValue[]> {
    const snapshots = await this.prisma.inventoryValue.findMany({
      where: {
        userId,
        snapshotDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { snapshotDate: "asc" },
    });
    return snapshots.map((s) => this.mapToEntity(s));
  }

  async calculateCurrent(userId: string): Promise<Omit<InventoryValue, "id" | "snapshotDate" | "userId">> {
    const products = await this.prisma.product.findMany({
      where: { userId },
      select: {
        quantity: true,
        price: true,
        lowStockAt: true,
      },
    });

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + p.quantity * Number(p.price), 0);
    const lowStockCount = products.filter(
      (p) => p.lowStockAt !== null && p.quantity <= p.lowStockAt
    ).length;
    const outOfStockCount = products.filter((p) => p.quantity === 0).length;

    return {
      totalProducts,
      totalQuantity,
      totalValue,
      lowStockCount,
      outOfStockCount,
    };
  }

  private mapToEntity(snapshot: any): InventoryValue {
    return {
      id: snapshot.id,
      userId: snapshot.userId,
      totalProducts: snapshot.totalProducts,
      totalQuantity: snapshot.totalQuantity,
      totalValue: Number(snapshot.totalValue),
      lowStockCount: snapshot.lowStockCount,
      outOfStockCount: snapshot.outOfStockCount,
      snapshotDate: snapshot.snapshotDate,
    };
  }
}

