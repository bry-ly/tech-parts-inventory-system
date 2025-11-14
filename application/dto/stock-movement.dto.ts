import { z } from "zod";

export const StockMovementTypeEnum = z.enum(["IN", "OUT", "ADJUSTMENT", "RETURN"]);

export const CreateStockMovementSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  supplierId: z.string().optional().nullable(),
  batchId: z.string().optional().nullable(),
  type: StockMovementTypeEnum,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0).optional().nullable(),
  reference: z.string().max(200).optional().nullable(),
  reason: z.string().max(500).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export const StockAdjustmentSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  newQuantity: z.number().int().min(0, "Quantity cannot be negative"),
  reason: z.string().min(1, "Reason is required").max(500),
  notes: z.string().max(5000).optional().nullable(),
});

export const BulkStockMovementSchema = z.object({
  movements: z.array(CreateStockMovementSchema).min(1, "At least one movement is required"),
});

export type CreateStockMovementDTO = z.infer<typeof CreateStockMovementSchema>;
export type StockAdjustmentDTO = z.infer<typeof StockAdjustmentSchema>;
export type BulkStockMovementDTO = z.infer<typeof BulkStockMovementSchema>;



