import { z } from "zod";

export const CreateBatchSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  batchNumber: z.string().min(1, "Batch number is required").max(100),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  manufacturedAt: z.date().optional().nullable(),
  expiresAt: z.date().optional().nullable(),
  receivedAt: z.date().default(new Date()),
  notes: z.string().max(5000).optional().nullable(),
}).refine(
  (data) => {
    if (data.manufacturedAt && data.expiresAt) {
      return data.expiresAt > data.manufacturedAt;
    }
    return true;
  },
  {
    message: "Expiry date must be after manufacturing date",
    path: ["expiresAt"],
  }
);

export const UpdateBatchSchema = CreateBatchSchema.partial().omit({ productId: true });

export type CreateBatchDTO = z.infer<typeof CreateBatchSchema>;
export type UpdateBatchDTO = z.infer<typeof UpdateBatchSchema>;



