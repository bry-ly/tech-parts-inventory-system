// Repository interface for Category - defines data access contract
import type { Category } from "../entities/category.entity";

export interface CategoryRepository {
  create(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category>;
  findById(id: string, userId: string): Promise<Category | null>;
  findByUserId(userId: string): Promise<Category[]>;
  findByName(userId: string, name: string): Promise<Category | null>;
  update(id: string, userId: string, data: Partial<Category>): Promise<Category>;
  delete(id: string, userId: string): Promise<void>;
}

