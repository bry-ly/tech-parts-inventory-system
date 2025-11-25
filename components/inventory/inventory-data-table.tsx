"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInventoryFilters } from "@/hooks/use-inventory-filters";
import { useInventoryExport } from "@/hooks/use-inventory-export";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconFilter,
  IconDownload,
  IconFileSpreadsheet,
  IconAlertCircle,
  IconSearch,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { updateProduct } from "@/lib/action/product";
import {
  CONDITIONS,
  CONDITION_BADGES,
  DEFAULT_COLUMN_VISIBILITY,
  COLUMN_VISIBILITY_VERSION,
} from "@/lib/constants/inventory";
import type { Product, CategoryOption, InitialFilters } from "@/lib/types";
import { ProductNameCell } from "./columns/cells/product-name-cell";
import { QuantityCell } from "./columns/cells/quantity-cell";
import { ActionsCell } from "./columns/cells/actions-cell";
interface InventoryDataTableProps {
  items: Product[];
  categories: CategoryOption[];
  tags: { id: string; name: string }[];
  initialFilters?: InitialFilters;
}
export function InventoryDataTable({
  items,
  categories,
  tags,
  initialFilters,
}: InventoryDataTableProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  // Use custom hooks for state management
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    manufacturerFilter,
    setManufacturerFilter,
    conditionFilter,
    setConditionFilter,
    lowStockFilter,
    setLowStockFilter,
    filteredItems,
    uniqueManufacturers,
  } = useInventoryFilters({ items, initialFilters });
  const { exportToCSV, exportToExcel } = useInventoryExport(filteredItems);
  // UI state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [detailsProduct, setDetailsProduct] = React.useState<Product | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("inventory-column-visibility");
        const version = localStorage.getItem(
          "inventory-column-visibility-version"
        );
        if (!version || version !== COLUMN_VISIBILITY_VERSION) {
          localStorage.setItem(
            "inventory-column-visibility-version",
            COLUMN_VISIBILITY_VERSION
          );
          localStorage.setItem(
            "inventory-column-visibility",
            JSON.stringify(DEFAULT_COLUMN_VISIBILITY)
          );
          return DEFAULT_COLUMN_VISIBILITY;
        }
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return DEFAULT_COLUMN_VISIBILITY;
          }
        }
      }
      return DEFAULT_COLUMN_VISIBILITY;
    });
  const [pagination, setPagination] = React.useState({
    pageIndex: initialFilters?.page ?? 0,
    pageSize: initialFilters?.pageSize ?? 12,
  });
  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [editForm, setEditForm] = React.useState<
    Record<string, string | string[]>
  >({});
  const [isSubmitting, startEditTransition] = React.useTransition();
  // Save column visibility to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "inventory-column-visibility",
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility]);
  const handleEditClick = React.useCallback((product: Product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      categoryId: product.categoryId ?? "",
      manufacturer: product.manufacturer ?? "",
      model: product.model ?? "",
      quantity: String(product.quantity ?? 0),
      lowStockAt: product.lowStockAt != null ? String(product.lowStockAt) : "",
      condition: product.condition ?? "new",
      location: product.location ?? "",
      price: String(product.price ?? 0),
      warrantyMonths:
        product.warrantyMonths != null ? String(product.warrantyMonths) : "",
      notes: product.notes ?? "",
      compatibility: product.compatibility ?? "",
      supplier: product.supplier ?? "",
      specs: product.specs ?? "",
      imageUrl: product.imageUrl ?? "",
      tagIds: product.tags?.map((t) => t.id) ?? [],
    });
    setIsEditOpen(true);
  }, []);
  const handleViewDetails = React.useCallback((product: Product) => {
    setDetailsProduct(product);
    setDetailsOpen(true);
  }, []);
  const handleEditSubmit = React.useCallback(async () => {
    if (!editProduct) return;
    startEditTransition(async () => {
      const formData = new FormData();
      formData.append("id", editProduct.id);
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === "tagIds" && Array.isArray(value)) {
          value.forEach((tagId) => formData.append("tagIds", tagId));
        } else if (value !== "" && value != null) {
          formData.append(key, String(value));
        }
      });
      try {
        const result = await updateProduct(formData);
        if (result?.success) {
          toast.success(result.message ?? "Product updated successfully");
          setIsEditOpen(false);
          setEditProduct(null);
          router.refresh();
        } else {
          toast.error(result?.message ?? "Failed to update product");
        }
      } catch {
        toast.error("An unexpected error occurred");
      }
    });
  }, [editProduct, editForm, router]);
  // Define table columns
  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => <ProductNameCell product={row.original} />,
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="w-fit">
            {row.original.categoryName || "Uncategorized"}
          </Badge>
        ),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.original.tags || [];
          if (tags.length === 0)
            return <span className="text-sm text-muted-foreground">—</span>;
          return (
            <div className="flex flex-wrap gap-1 max-w-[300px]">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.manufacturer || "—"}</span>
        ),
      },
      {
        accessorKey: "model",
        header: "Model",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.model || "—"}</span>
        ),
      },
      {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ row }) => {
          const condition = (row.original.condition ||
            "new") as import("@/lib/constants/inventory").Condition;
          const badgeConfig = CONDITION_BADGES[condition];
          return (
            <Badge variant="outline" className={badgeConfig.className}>
              {badgeConfig.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => <QuantityCell product={row.original} />,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="font-medium">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(Number(row.original.price || 0))}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.location || "—"}</span>
        ),
      },
      {
        accessorKey: "warrantyMonths",
        header: "Warranty",
        cell: ({ row }) => {
          const months = row.original.warrantyMonths;
          if (!months) return <span className="text-sm">—</span>;
          return <span className="text-sm">{months} months</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionsCell
            product={row.original}
            onEdit={handleEditClick}
            onViewDetails={handleViewDetails}
          />
        ),
      },
    ],
    [handleEditClick, handleViewDetails]
  );
  const table = useReactTable({
    data: filteredItems,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={manufacturerFilter}
            onValueChange={(value) => {
              setManufacturerFilter(value);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Manufacturers</SelectItem>
              {uniqueManufacturers.map((mfr) => (
                <SelectItem key={mfr} value={mfr as string}>
                  {mfr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={conditionFilter}
            onValueChange={(value) => {
              setConditionFilter(value);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {CONDITIONS.map((cond) => (
                <SelectItem key={cond} value={cond}>
                  {cond.charAt(0).toUpperCase() + cond.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={lowStockFilter ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setLowStockFilter(!lowStockFilter);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
          >
            <IconAlertCircle className="h-4 w-4 mr-2" />
            Low Stock
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconFilter className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDownload className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToCSV}>
                <IconDownload className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <IconFileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Edit Dialog - Full functionality with tags */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product: {editProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Product Details Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={editForm.sku || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, sku: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={editForm.categoryId || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Manufacturer</Label>
                  <Input
                    value={editForm.manufacturer || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        manufacturer: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={editForm.model || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <select
                    value={editForm.condition || "new"}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        condition: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Inventory & Pricing Section */}
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Inventory & Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={editForm.quantity || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={editForm.lowStockAt || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        lowStockAt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Additional Details Section */}
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input
                    value={editForm.supplier || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        supplier: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty (months)</Label>
                  <Input
                    type="number"
                    value={editForm.warrantyMonths || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        warrantyMonths: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* Tags Section */}
              {tags && tags.length > 0 && (
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 p-4 border rounded-lg">
                    {tags.map((tag) => {
                      const isSelected = Array.isArray(editForm.tagIds)
                        ? editForm.tagIds.includes(tag.id)
                        : false;
                      return (
                        <label
                          key={tag.id}
                          className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              setEditForm((prev) => {
                                const currentTags = Array.isArray(prev.tagIds)
                                  ? prev.tagIds
                                  : [];
                                const newTags = e.target.checked
                                  ? [...currentTags, tag.id]
                                  : currentTags.filter((id) => id !== tag.id);
                                return { ...prev, tagIds: newTags };
                              });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{tag.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Specifications</Label>
                <Textarea
                  value={editForm.specs || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, specs: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Compatibility</Label>
                <Textarea
                  value={editForm.compatibility || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      compatibility: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editForm.notes || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Details Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{detailsProduct?.name}</DrawerTitle>
              <DrawerDescription>Product Details</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              {detailsProduct && (
                <>
                  {detailsProduct.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={detailsProduct.imageUrl}
                        alt={detailsProduct.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>SKU:</strong> {detailsProduct.sku || "—"}
                    </div>
                    <div>
                      <strong>Category:</strong>{" "}
                      {detailsProduct.categoryName || "—"}
                    </div>
                    <div>
                      <strong>Manufacturer:</strong>{" "}
                      {detailsProduct.manufacturer || "—"}
                    </div>
                    <div>
                      <strong>Model:</strong> {detailsProduct.model || "—"}
                    </div>
                    <div>
                      <strong>Condition:</strong>{" "}
                      {detailsProduct.condition || "—"}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {detailsProduct.quantity}
                    </div>
                    <div>
                      <strong>Price:</strong>{" "}
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(Number(detailsProduct.price))}
                    </div>
                    {detailsProduct.specs && (
                      <div>
                        <strong>Specs:</strong> {detailsProduct.specs}
                      </div>
                    )}
                    {detailsProduct.notes && (
                      <div>
                        <strong>Notes:</strong> {detailsProduct.notes}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <DrawerFooter>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{detailsProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {detailsProduct && (
                <>
                  {detailsProduct.imageUrl && (
                    <div className="relative w-full h-64">
                      <Image
                        src={detailsProduct.imageUrl}
                        alt={detailsProduct.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>SKU:</strong> {detailsProduct.sku || "—"}
                    </div>
                    <div>
                      <strong>Category:</strong>{" "}
                      {detailsProduct.categoryName || "—"}
                    </div>
                    <div>
                      <strong>Manufacturer:</strong>{" "}
                      {detailsProduct.manufacturer || "—"}
                    </div>
                    <div>
                      <strong>Model:</strong> {detailsProduct.model || "—"}
                    </div>
                    <div>
                      <strong>Condition:</strong>{" "}
                      {detailsProduct.condition || "—"}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {detailsProduct.quantity}
                    </div>
                    <div>
                      <strong>Price:</strong>{" "}
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(Number(detailsProduct.price))}
                    </div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {detailsProduct.location || "—"}
                    </div>
                  </div>
                  {detailsProduct.specs && (
                    <div>
                      <strong>Specifications:</strong>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {detailsProduct.specs}
                      </p>
                    </div>
                  )}
                  {detailsProduct.notes && (
                    <div>
                      <strong>Notes:</strong>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {detailsProduct.notes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
