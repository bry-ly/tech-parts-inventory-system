// Prisma implementation of CategoryRepository
import { prisma } from "./prisma.repository";
import type { CategoryRepository } from "@/domain/interfaces/category.repository";
import type { Category } from "@/domain/entities/category.entity";

export class CategoryRepositoryImpl implements CategoryRepository {
  async create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        userId: data.userId,
        name: data.name,
      },
    });

    return this.mapToDomain(category);
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) return null;

    return this.mapToDomain(category);
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return categories.map(this.mapToDomain);
  }

  async findByName(userId: string, name: string): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (!category) return null;

    return this.mapToDomain(category);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Category>
  ): Promise<Category> {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return this.mapToDomain(category);
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  private mapToDomain(category: any): Category {
    return {
      id: category.id,
      userId: category.userId,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

