import { Supplier, ProductSupplier } from "../entities/supplier.entity";

export interface SupplierRepository {
  create(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier>;
  findById(id: string): Promise<Supplier | null>;
  findByUserId(userId: string): Promise<Supplier[]>;
  findActiveByUserId(userId: string): Promise<Supplier[]>;
  update(id: string, data: Partial<Supplier>): Promise<Supplier>;
  delete(id: string): Promise<void>;
  
  // Product-Supplier relations
  linkProduct(data: Omit<ProductSupplier, "id" | "createdAt" | "updatedAt">): Promise<ProductSupplier>;
  unlinkProduct(productId: string, supplierId: string): Promise<void>;
  findProductSuppliers(productId: string): Promise<ProductSupplier[]>;
  findSupplierProducts(supplierId: string): Promise<ProductSupplier[]>;
  updateProductSupplier(id: string, data: Partial<ProductSupplier>): Promise<ProductSupplier>;
}



