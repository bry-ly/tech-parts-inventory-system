import { StockAlertRepository } from "@/domain/interfaces/stock-alert.repository";
import { StockAlert, StockAlertType } from "@/domain/entities/stock-alert.entity";
import { CreateStockAlertDTO } from "../dto/stock-alert.dto";

export class StockAlertUseCase {
  constructor(private stockAlertRepository: StockAlertRepository) {}

  async createAlert(userId: string, data: CreateStockAlertDTO): Promise<StockAlert> {
    return await this.stockAlertRepository.create({
      userId,
      ...data,
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedAt: null,
    });
  }

  async getAlert(id: string): Promise<StockAlert | null> {
    return await this.stockAlertRepository.findById(id);
  }

  async getUserAlerts(userId: string, includeAcknowledged: boolean = false): Promise<StockAlert[]> {
    return await this.stockAlertRepository.findByUserId(userId, includeAcknowledged);
  }

  async getAlertsByType(userId: string, type: StockAlertType): Promise<StockAlert[]> {
    return await this.stockAlertRepository.findByType(userId, type);
  }

  async getProductAlerts(productId: string): Promise<StockAlert[]> {
    return await this.stockAlertRepository.findByProductId(productId);
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<StockAlert> {
    return await this.stockAlertRepository.acknowledge(id, acknowledgedBy);
  }

  async resolveAlert(id: string): Promise<StockAlert> {
    return await this.stockAlertRepository.resolve(id);
  }

  async deleteAlert(id: string): Promise<void> {
    await this.stockAlertRepository.delete(id);
  }

  async getUnacknowledgedCount(userId: string): Promise<number> {
    return await this.stockAlertRepository.getUnacknowledgedCount(userId);
  }

  async bulkAcknowledge(alertIds: string[], acknowledgedBy: string): Promise<void> {
    for (const id of alertIds) {
      await this.stockAlertRepository.acknowledge(id, acknowledgedBy);
    }
  }
}



