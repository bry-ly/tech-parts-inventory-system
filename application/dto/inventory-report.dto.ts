import { z } from "zod";

export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

export const InventoryReportSchema = z.object({
  userId: z.string().min(1),
  reportType: z.enum(["SUMMARY", "MOVEMENTS", "LOW_STOCK", "VALUE_TREND", "SUPPLIER_ANALYSIS"]),
  dateRange: DateRangeSchema.optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
});

export const ExportInventorySchema = z.object({
  format: z.enum(["CSV", "XLSX", "PDF"]),
  includeImages: z.boolean().default(false),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
});

export type DateRangeDTO = z.infer<typeof DateRangeSchema>;
export type InventoryReportDTO = z.infer<typeof InventoryReportSchema>;
export type ExportInventoryDTO = z.infer<typeof ExportInventorySchema>;



