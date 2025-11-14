import { PrismaClient } from "@prisma/client";
import { Supplier, ProductSupplier } from "@/domain/entities/supplier.entity";
import { SupplierRepository } from "@/domain/interfaces/supplier.repository";

export class PrismaSupplierRepository implements SupplierRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> {
    const supplier = await this.prisma.supplier.create({
      data,
    });
    return this.mapToEntity(supplier);
  }

  async findById(id: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    return supplier ? this.mapToEntity(supplier) : null;
  }

  async findByUserId(userId: string): Promise<Supplier[]> {
    const suppliers = await this.prisma.supplier.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    return suppliers.map((s) => this.mapToEntity(s));
  }

  async findActiveByUserId(userId: string): Promise<Supplier[]> {
    const suppliers = await this.prisma.supplier.findMany({
      where: { userId, active: true },
      orderBy: { name: "asc" },
    });
    return suppliers.map((s) => this.mapToEntity(s));
  }

  async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const supplier = await this.prisma.supplier.update({
      where: { id },
      data,
    });
    return this.mapToEntity(supplier);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.delete({
      where: { id },
    });
  }

  async linkProduct(data: Omit<ProductSupplier, "id" | "createdAt" | "updatedAt">): Promise<ProductSupplier> {
    const link = await this.prisma.productSupplier.create({
      data: {
        productId: data.productId,
        supplierId: data.supplierId,
        supplierSku: data.supplierSku,
        costPrice: data.costPrice,
        leadTimeDays: data.leadTimeDays,
        minOrderQty: data.minOrderQty,
        isPrimary: data.isPrimary,
      },
    });
    return this.mapToProductSupplierEntity(link);
  }

  async unlinkProduct(productId: string, supplierId: string): Promise<void> {
    await this.prisma.productSupplier.deleteMany({
      where: { productId, supplierId },
    });
  }

  async findProductSuppliers(productId: string): Promise<ProductSupplier[]> {
    const links = await this.prisma.productSupplier.findMany({
      where: { productId },
      orderBy: { isPrimary: "desc" },
    });
    return links.map((l) => this.mapToProductSupplierEntity(l));
  }

  async findSupplierProducts(supplierId: string): Promise<ProductSupplier[]> {
    const links = await this.prisma.productSupplier.findMany({
      where: { supplierId },
    });
    return links.map((l) => this.mapToProductSupplierEntity(l));
  }

  async updateProductSupplier(id: string, data: Partial<ProductSupplier>): Promise<ProductSupplier> {
    const link = await this.prisma.productSupplier.update({
      where: { id },
      data,
    });
    return this.mapToProductSupplierEntity(link);
  }

  private mapToEntity(supplier: any): Supplier {
    return {
      id: supplier.id,
      userId: supplier.userId,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      website: supplier.website,
      notes: supplier.notes,
      active: supplier.active,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }

  private mapToProductSupplierEntity(link: any): ProductSupplier {
    return {
      id: link.id,
      productId: link.productId,
      supplierId: link.supplierId,
      supplierSku: link.supplierSku,
      costPrice: Number(link.costPrice),
      leadTimeDays: link.leadTimeDays,
      minOrderQty: link.minOrderQty,
      isPrimary: link.isPrimary,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }
}

