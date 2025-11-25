/**
 * Custom hook for managing inventory filters and URL synchronization
 * Centralizes filter state management and keeps URL in sync with filters
 */

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Product, InitialFilters } from "@/lib/types";

interface UseInventoryFiltersProps {
  items: Product[];
  initialFilters?: InitialFilters;
}

export function useInventoryFilters({
  items,
  initialFilters,
}: UseInventoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialFilters?.search ?? "");
  const [categoryFilter, setCategoryFilter] = useState<string>(
    initialFilters?.category ?? "all"
  );
  const [manufacturerFilter, setManufacturerFilter] = useState<string>(
    initialFilters?.manufacturer ?? "all"
  );
  const [conditionFilter, setConditionFilter] = useState<string>(
    initialFilters?.condition ?? "all"
  );
  const [lowStockFilter, setLowStockFilter] = useState<boolean>(
    initialFilters?.lowStock ?? false
  );

  // Update URL with current filters
  const updateURL = useCallback(
    (filters: {
      search?: string;
      category?: string;
      manufacturer?: string;
      condition?: string;
      lowStock?: boolean;
      page?: number;
      pageSize?: number;
    }) => {
      const params = new URLSearchParams(searchParams);

      // Update or remove each filter
      if (filters.search) {
        params.set("search", filters.search);
      } else {
        params.delete("search");
      }

      if (filters.category && filters.category !== "all") {
        params.set("category", filters.category);
      } else {
        params.delete("category");
      }

      if (filters.manufacturer && filters.manufacturer !== "all") {
        params.set("manufacturer", filters.manufacturer);
      } else {
        params.delete("manufacturer");
      }

      if (filters.condition && filters.condition !== "all") {
        params.set("condition", filters.condition);
      } else {
        params.delete("condition");
      }

      if (filters.lowStock) {
        params.set("lowStock", "true");
      } else {
        params.delete("lowStock");
      }

      if (filters.page && filters.page > 0) {
        params.set("page", String(filters.page));
      } else {
        params.delete("page");
      }

      if (filters.pageSize && filters.pageSize !== 12) {
        params.set("pageSize", String(filters.pageSize));
      } else {
        params.delete("pageSize");
      }

      // Use replace to avoid cluttering browser history
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    },
    [pathname, router, searchParams]
  );

  // Get unique manufacturers for filter dropdown
  const uniqueManufacturers = useMemo(() => {
    const manufacturers = new Set(
      items.map((item) => item.manufacturer).filter(Boolean)
    );
    return Array.from(manufacturers).sort();
  }, [items]);

  // Apply all filters to items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        [
          item.name,
          item.sku ?? "",
          item.categoryName ?? "",
          item.manufacturer ?? "",
        ].some((value) => value?.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "__uncategorized") {
        filtered = filtered.filter((item) => !item.categoryId);
      } else {
        filtered = filtered.filter(
          (item) => item.categoryId === categoryFilter
        );
      }
    }

    // Manufacturer filter
    if (manufacturerFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.manufacturer === manufacturerFilter
      );
    }

    // Condition filter
    if (conditionFilter !== "all") {
      filtered = filtered.filter((item) => item.condition === conditionFilter);
    }

    // Low stock filter
    if (lowStockFilter) {
      filtered = filtered.filter((item) => {
        const lowThreshold =
          item.lowStockAt == null ? undefined : Number(item.lowStockAt);
        return (
          typeof lowThreshold === "number" &&
          Number(item.quantity) <= lowThreshold
        );
      });
    }

    return filtered;
  }, [
    items,
    searchTerm,
    categoryFilter,
    manufacturerFilter,
    conditionFilter,
    lowStockFilter,
  ]);

  return {
    // State values
    searchTerm,
    categoryFilter,
    manufacturerFilter,
    conditionFilter,
    lowStockFilter,

    // State setters
    setSearchTerm,
    setCategoryFilter,
    setManufacturerFilter,
    setConditionFilter,
    setLowStockFilter,

    // Computed values
    filteredItems,
    uniqueManufacturers,

    // Functions
    updateURL,
  };
}
