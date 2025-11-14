// Domain entity for Supplier
export interface Supplier {
  id: string;
  userId: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSupplier {
  id: string;
  productId: string;
  supplierId: string;
  supplierSku: string | null;
  costPrice: number;
  leadTimeDays: number | null;
  minOrderQty: number | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}



