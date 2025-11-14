import { InventoryValueRepository } from "@/domain/interfaces/inventory-value.repository";
import { InventoryValue } from "@/domain/entities/inventory-value.entity";
import { ProductRepository } from "@/domain/interfaces/product.repository";
import { StockMovementRepository } from "@/domain/interfaces/stock-movement.repository";

export class InventoryAnalyticsUseCase {
  constructor(
    private inventoryValueRepository: InventoryValueRepository,
    private productRepository: ProductRepository,
    private stockMovementRepository: StockMovementRepository
  ) {}

  async createSnapshot(userId: string): Promise<InventoryValue> {
    const current = await this.inventoryValueRepository.calculateCurrent(userId);
    return await this.inventoryValueRepository.create({
      userId,
      ...current,
    });
  }

  async getLatestSnapshot(userId: string): Promise<InventoryValue | null> {
    return await this.inventoryValueRepository.findLatest(userId);
  }

  async getSnapshotHistory(userId: string, limit: number = 30): Promise<InventoryValue[]> {
    return await this.inventoryValueRepository.findByUserId(userId, limit);
  }

  async getValueTrend(userId: string, startDate: Date, endDate: Date): Promise<InventoryValue[]> {
    return await this.inventoryValueRepository.findByDateRange(userId, startDate, endDate);
  }

  async getCurrentMetrics(userId: string): Promise<{
    totalProducts: number;
    totalQuantity: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    averageValue: number;
  }> {
    const current = await this.inventoryValueRepository.calculateCurrent(userId);
    const averageValue = current.totalProducts > 0 ? current.totalValue / current.totalProducts : 0;

    return {
      ...current,
      averageValue,
    };
  }

  async getStockMovementSummary(userId: string, days: number = 30): Promise<{
    totalIn: number;
    totalOut: number;
    totalAdjustments: number;
    totalReturns: number;
    netChange: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totals = await this.stockMovementRepository.getTotalsByType(userId, startDate, endDate);

    const netChange = totals.IN + totals.RETURN - totals.OUT + totals.ADJUSTMENT;

    return {
      totalIn: totals.IN,
      totalOut: totals.OUT,
      totalAdjustments: totals.ADJUSTMENT,
      totalReturns: totals.RETURN,
      netChange,
    };
  }

  async getTopProducts(userId: string, limit: number = 10): Promise<any[]> {
    // This would need to be implemented based on your criteria
    // For example: highest value, most stock movements, etc.
    const products = await this.productRepository.findByUserId(userId);
    
    // Sort by total value (quantity * price)
    return products
      .map((p) => ({
        ...p,
        totalValue: p.quantity * p.price,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, limit);
  }

  async getLowStockProducts(userId: string): Promise<any[]> {
    const products = await this.productRepository.findByUserId(userId);
    
    return products.filter(
      (p) => p.lowStockAt !== null && p.quantity <= p.lowStockAt
    );
  }

  async getOutOfStockProducts(userId: string): Promise<any[]> {
    const products = await this.productRepository.findByUserId(userId);
    return products.filter((p) => p.quantity === 0);
  }
}



