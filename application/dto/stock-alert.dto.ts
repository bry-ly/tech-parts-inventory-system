import { z } from "zod";

export const StockAlertTypeEnum = z.enum(["LOW_STOCK", "OUT_OF_STOCK", "EXPIRING_SOON", "EXPIRED"]);

export const CreateStockAlertSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  type: StockAlertTypeEnum,
  message: z.string().min(1, "Message is required").max(500),
  threshold: z.number().int().min(0).optional().nullable(),
  currentValue: z.number().int().min(0).optional().nullable(),
});

export const AcknowledgeAlertSchema = z.object({
  alertId: z.string().min(1, "Alert ID is required"),
});

export type CreateStockAlertDTO = z.infer<typeof CreateStockAlertSchema>;
export type AcknowledgeAlertDTO = z.infer<typeof AcknowledgeAlertSchema>;



