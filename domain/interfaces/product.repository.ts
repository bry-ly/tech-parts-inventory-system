// Repository interface for Product - defines data access contract
import type { Product } from "../entities/product.entity";

export interface ProductRepository {
  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>;
  findById(id: string, userId?: string): Promise<Product | null>;
  findByUserId(userId: string): Promise<Product[]>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string, userId?: string): Promise<void>;
  updateQuantity(id: string, quantity: number): Promise<Product>;
}

