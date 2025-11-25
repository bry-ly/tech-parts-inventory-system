/**
 * Inventory-related constants
 * Centralized location for all inventory constants to prevent duplication
 */

export const CONDITIONS = ["new", "used", "refurbished", "for-parts"] as const;

export type Condition = (typeof CONDITIONS)[number];

export const CONDITION_BADGES: Record<
  Condition,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  },
  refurbished: {
    label: "Refurbished",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  used: {
    label: "Used",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  },
  "for-parts": {
    label: "For Parts",
    className:
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  },
};

export const STOCK_STATUS_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  "out-of-stock": {
    label: "Out of Stock",
    className:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  "low-stock": {
    label: "Low Stock",
    className:
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  "in-stock": {
    label: "In Stock",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800",
  },
};

export type StockStatus = "out-of-stock" | "low-stock" | "in-stock";

/**
 * Default column visibility settings for the inventory table
 * Version 2: Cleaner default with hidden secondary columns
 */
export const DEFAULT_COLUMN_VISIBILITY = {
  tags: false,
  manufacturer: false,
  condition: false,
  warrantyMonths: false,
  location: false,
  lowStockAt: false,
};

export const COLUMN_VISIBILITY_VERSION = "2";

/**
 * Determine stock status based on quantity and low stock threshold
 */
export function getStockStatus(
  quantity: number,
  lowStockAt: number | null | undefined
): StockStatus {
  if (quantity === 0) return "out-of-stock";
  if (lowStockAt != null && quantity <= lowStockAt) return "low-stock";
  return "in-stock";
}
