// Prisma implementation of ProductRepository
import { prisma } from "./prisma.repository";
import type { ProductRepository } from "@/domain/interfaces/product.repository";
import type { Product } from "@/domain/entities/product.entity";
import { Prisma } from "@prisma/client";

export class ProductRepositoryImpl implements ProductRepository {
  async create(
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        name: data.name,
        manufacturer: data.manufacturer,
        model: data.model,
        sku: data.sku,
        quantity: data.quantity,
        lowStockAt: data.lowStockAt,
        condition: data.condition,
        location: data.location,
        price: data.price,
        specs: data.specs,
        compatibility: data.compatibility,
        supplier: data.supplier,
        warrantyMonths: data.warrantyMonths,
        notes: data.notes,
        imageUrl: data.imageUrl,
      },
      include: { category: true },
    });

    return this.mapToDomain(product);
  }

  async findById(id: string, userId?: string): Promise<Product | null> {
    const where: any = { id };
    if (userId) where.userId = userId;

    const product = await prisma.product.findFirst({ where });

    if (!product) return null;

    return this.mapToDomain(product);
  }

  async findByUserId(userId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return products.map((p) => this.mapToDomain(p));
  }

  async update(
    id: string,
    data: Partial<Product>
  ): Promise<Product> {
    const updatePayload: Prisma.ProductUpdateInput = { ...data };

    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        updatePayload.category = {
          connect: { id: data.categoryId },
        };
      } else {
        updatePayload.category = {
          disconnect: true,
        };
      }
      delete (updatePayload as any).categoryId;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updatePayload,
    });

    return this.mapToDomain(product);
  }

  async delete(id: string, userId?: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async updateQuantity(
    id: string,
    quantity: number
  ): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: { quantity },
    });

    return this.mapToDomain(product);
  }

  private mapToDomain(product: any): Product {
    return {
      id: product.id,
      userId: product.userId,
      categoryId: product.categoryId,
      name: product.name,
      manufacturer: product.manufacturer,
      model: product.model,
      sku: product.sku,
      quantity: product.quantity,
      lowStockAt: product.lowStockAt,
      condition: product.condition,
      location: product.location,
      price: Number(product.price),
      specs: product.specs,
      compatibility: product.compatibility,
      supplier: product.supplier,
      warrantyMonths: product.warrantyMonths,
      notes: product.notes,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

