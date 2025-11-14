import { StockMovementRepository } from "@/domain/interfaces/stock-movement.repository";
import { StockMovement, StockMovementType } from "@/domain/entities/stock-movement.entity";
import { ProductRepository } from "@/domain/interfaces/product.repository";
import { StockAlertRepository } from "@/domain/interfaces/stock-alert.repository";
import { CreateStockMovementDTO, StockAdjustmentDTO } from "../dto/stock-movement.dto";

export class StockMovementUseCase {
  constructor(
    private stockMovementRepository: StockMovementRepository,
    private productRepository: ProductRepository,
    private stockAlertRepository: StockAlertRepository
  ) {}

  async createStockMovement(
    userId: string,
    performedBy: string,
    data: CreateStockMovementDTO
  ): Promise<StockMovement> {
    // Get current product
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Calculate new quantity based on movement type
    let newQty = product.quantity;
    const previousQty = product.quantity;

    switch (data.type) {
      case "IN":
      case "RETURN":
        newQty += data.quantity;
        break;
      case "OUT":
        newQty -= data.quantity;
        if (newQty < 0) {
          throw new Error("Insufficient stock");
        }
        break;
      case "ADJUSTMENT":
        // For adjustment, quantity represents the change (positive or negative)
        newQty = data.quantity;
        break;
    }

    // Calculate total cost
    const totalCost = data.unitCost ? data.unitCost * data.quantity : null;

    // Create movement record
    const movement = await this.stockMovementRepository.create({
      userId,
      productId: data.productId,
      supplierId: data.supplierId || null,
      batchId: data.batchId || null,
      type: data.type,
      quantity: data.quantity,
      previousQty,
      newQty,
      unitCost: data.unitCost || null,
      totalCost,
      reference: data.reference || null,
      reason: data.reason || null,
      notes: data.notes || null,
      performedBy,
    });

    // Update product quantity
    await this.productRepository.update(data.productId, { quantity: newQty });

    // Check for stock alerts
    await this.checkAndCreateAlerts(userId, data.productId, newQty, product.lowStockAt);

    return movement;
  }

  async adjustStock(
    userId: string,
    performedBy: string,
    data: StockAdjustmentDTO
  ): Promise<StockMovement> {
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const previousQty = product.quantity;
    const newQty = data.newQuantity;
    const quantityDiff = newQty - previousQty;

    const movement = await this.stockMovementRepository.create({
      userId,
      productId: data.productId,
      supplierId: null,
      batchId: null,
      type: "ADJUSTMENT",
      quantity: Math.abs(quantityDiff),
      previousQty,
      newQty,
      unitCost: null,
      totalCost: null,
      reference: null,
      reason: data.reason,
      notes: data.notes || null,
      performedBy,
    });

    await this.productRepository.update(data.productId, { quantity: newQty });
    await this.checkAndCreateAlerts(userId, data.productId, newQty, product.lowStockAt);

    return movement;
  }

  async getStockMovements(userId: string, limit?: number): Promise<StockMovement[]> {
    return await this.stockMovementRepository.findByUserId(userId, limit);
  }

  async getProductStockHistory(productId: string, limit?: number): Promise<StockMovement[]> {
    return await this.stockMovementRepository.findByProductId(productId, limit);
  }

  async getMovementsByType(
    userId: string,
    type: StockMovementType,
    limit?: number
  ): Promise<StockMovement[]> {
    return await this.stockMovementRepository.findByType(userId, type, limit);
  }

  async getMovementsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StockMovement[]> {
    return await this.stockMovementRepository.findByDateRange(userId, startDate, endDate);
  }

  async getMovementTotals(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<StockMovementType, number>> {
    return await this.stockMovementRepository.getTotalsByType(userId, startDate, endDate);
  }

  private async checkAndCreateAlerts(
    userId: string,
    productId: string,
    currentQty: number,
    lowStockThreshold: number | null
  ): Promise<void> {
    // Check if product is out of stock
    if (currentQty === 0) {
      await this.stockAlertRepository.create({
        userId,
        productId,
        type: "OUT_OF_STOCK",
        message: "Product is out of stock",
        threshold: lowStockThreshold,
        currentValue: currentQty,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolvedAt: null,
      });
    }
    // Check if product is low on stock
    else if (lowStockThreshold !== null && currentQty <= lowStockThreshold) {
      await this.stockAlertRepository.create({
        userId,
        productId,
        type: "LOW_STOCK",
        message: `Product stock is low (${currentQty} remaining)`,
        threshold: lowStockThreshold,
        currentValue: currentQty,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolvedAt: null,
      });
    }
  }
}



