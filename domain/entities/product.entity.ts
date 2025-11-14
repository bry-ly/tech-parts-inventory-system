// Domain entity for Product
export interface Product {
  id: string;
  userId: string;
  categoryId: string | null;
  name: string;
  manufacturer: string;
  model: string | null;
  sku: string | null;
  quantity: number;
  lowStockAt: number | null;
  condition: string;
  location: string | null;
  price: number;
  specs: string | null;
  compatibility: string | null;
  supplier: string | null;
  warrantyMonths: number | null;
  notes: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCondition = "new" | "used" | "refurbished" | "for-parts";

