import { SupplierRepository } from "@/domain/interfaces/supplier.repository";
import { Supplier, ProductSupplier } from "@/domain/entities/supplier.entity";
import {
  CreateSupplierDTO,
  UpdateSupplierDTO,
  LinkProductSupplierDTO,
  UpdateProductSupplierDTO,
} from "../dto/supplier.dto";

export class SupplierUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async createSupplier(userId: string, data: CreateSupplierDTO): Promise<Supplier> {
    return await this.supplierRepository.create({
      userId,
      ...data,
    });
  }

  async getSupplier(id: string): Promise<Supplier | null> {
    return await this.supplierRepository.findById(id);
  }

  async getAllSuppliers(userId: string): Promise<Supplier[]> {
    return await this.supplierRepository.findByUserId(userId);
  }

  async getActiveSuppliers(userId: string): Promise<Supplier[]> {
    return await this.supplierRepository.findActiveByUserId(userId);
  }

  async updateSupplier(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    return await this.supplierRepository.update(id, data);
  }

  async deleteSupplier(id: string): Promise<void> {
    await this.supplierRepository.delete(id);
  }

  async linkProductToSupplier(data: LinkProductSupplierDTO): Promise<ProductSupplier> {
    // If this is set as primary, unset other primary suppliers for this product
    if (data.isPrimary) {
      const existingLinks = await this.supplierRepository.findProductSuppliers(data.productId);
      for (const link of existingLinks) {
        if (link.isPrimary) {
          await this.supplierRepository.updateProductSupplier(link.id, { isPrimary: false });
        }
      }
    }

    return await this.supplierRepository.linkProduct(data);
  }

  async unlinkProductFromSupplier(productId: string, supplierId: string): Promise<void> {
    await this.supplierRepository.unlinkProduct(productId, supplierId);
  }

  async getProductSuppliers(productId: string): Promise<ProductSupplier[]> {
    return await this.supplierRepository.findProductSuppliers(productId);
  }

  async getSupplierProducts(supplierId: string): Promise<ProductSupplier[]> {
    return await this.supplierRepository.findSupplierProducts(supplierId);
  }

  async updateProductSupplier(id: string, data: UpdateProductSupplierDTO): Promise<ProductSupplier> {
    return await this.supplierRepository.updateProductSupplier(id, data);
  }
}



