import { z } from "zod";

export const CreateSupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required").max(200),
  contactPerson: z.string().max(200).optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  address: z.string().max(1000).optional().nullable(),
  website: z.string().url("Invalid URL").optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  active: z.boolean().default(true),
});

export const UpdateSupplierSchema = CreateSupplierSchema.partial();

export const LinkProductSupplierSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  supplierId: z.string().min(1, "Supplier ID is required"),
  supplierSku: z.string().max(100).optional().nullable(),
  costPrice: z.number().min(0, "Cost price must be positive"),
  leadTimeDays: z.number().int().min(0).optional().nullable(),
  minOrderQty: z.number().int().min(1).optional().nullable(),
  isPrimary: z.boolean().default(false),
});

export const UpdateProductSupplierSchema = LinkProductSupplierSchema.partial().omit({
  productId: true,
  supplierId: true,
});

export type CreateSupplierDTO = z.infer<typeof CreateSupplierSchema>;
export type UpdateSupplierDTO = z.infer<typeof UpdateSupplierSchema>;
export type LinkProductSupplierDTO = z.infer<typeof LinkProductSupplierSchema>;
export type UpdateProductSupplierDTO = z.infer<typeof UpdateProductSupplierSchema>;



