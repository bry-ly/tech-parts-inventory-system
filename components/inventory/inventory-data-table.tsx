"use client";

import * as React from "react";
import {
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Header,
  type HeaderGroup,
  type Row,
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
  IconAlertCircle,
  IconPackage,
  IconTrash,
  IconEdit,
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteProduct, updateProduct } from "@/lib/action/product";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  condition?: string | null;
  price: string | number;
  quantity: number;
  lowStockAt?: number | null;
  supplier?: string | null;
  imageUrl?: string | null;
  warrantyMonths?: number | null;
  location?: string | null;
  compatibility?: string | null;
  notes?: string | null;
  userId: string;
  createdAt: Date;
}

const CONDITIONS = ["new", "used", "refurbished", "for-parts"] as const;

const CONDITION_BADGES: Record<string, string> = {
  new: "bg-green-50 text-green-700",
  refurbished: "bg-blue-50 text-blue-700",
  used: "bg-yellow-50 text-yellow-700",
  "for-parts": "bg-orange-50 text-orange-700",
};

const CATEGORIES = [
  "processors",
  "motherboards",
  "memory",
  "storage",
  "graphics",
  "networking",
  "peripherals",
  "cooling",
] as const;

export function InventoryDataTable({ items }: { items: Product[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [editForm, setEditForm] = React.useState<Record<string, string>>({});
  const [isSubmitting, startEditTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteDialogProduct, setDeleteDialogProduct] =
    React.useState<Product | null>(null);

  const handleEditClick = React.useCallback((product: Product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      category: product.category ?? "",
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
    });
    setIsEditOpen(true);
  }, []);

  const handleDeleteClick = React.useCallback((product: Product) => {
    setDeleteDialogProduct(product);
  }, []);

  const handleDelete = React.useCallback(
    (id: string) => {
      if (!id) return;

      setDeletingId(id);
      startEditTransition(async () => {
        const formData = new FormData();
        formData.append("id", id);
        try {
          const result = await deleteProduct(formData);
          if (result?.success) {
            toast.success(result.message ?? "Product deleted successfully.");
          } else {
            toast.error(result?.message ?? "Failed to delete product.");
          }
        } catch {
          toast.error("Failed to delete product.");
        } finally {
          setDeletingId(null);
          setDeleteDialogProduct(null);
        }
      });
    },
    [startEditTransition]
  );

  const handleDeleteConfirm = React.useCallback(() => {
    if (!deleteDialogProduct) return;
    handleDelete(deleteDialogProduct.id);
  }, [deleteDialogProduct, handleDelete]);

  const isDeletingSelectedProduct =
    deleteDialogProduct != null && deletingId === deleteDialogProduct.id;

  const filteredItems = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    const searchLower = searchTerm.trim().toLowerCase();
    return items.filter((item) =>
      [
        item.name,
        item.sku ?? "",
        item.category ?? "",
        item.manufacturer ?? "",
      ].some((value) => value?.toLowerCase().includes(searchLower))
    );
  }, [items, searchTerm]);

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-3">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="h-10 w-10 rounded object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-card-foreground">
                  <IconPackage className="h-5 w-5 text-secondary" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-primary">
                  {product.name}
                </span>
                {product.sku && (
                  <span className="text-xs text-primary">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="w-fit">
            {row.original.category || "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.manufacturer || "—"}</span>
        ),
      },
      {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ row }) => {
          const condition = row.original.condition || "new";
          return (
            <Badge
              variant="secondary"
              className={`w-fit ${CONDITION_BADGES[condition] || "bg-muted"}`}
            >
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const product = row.original;
          const qty = Number(product.quantity || 0);
          const lowThreshold =
            product.lowStockAt == null ? undefined : Number(product.lowStockAt);
          const isLow = typeof lowThreshold === "number" && qty <= lowThreshold;

          return (
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isLow ? "text-red-600" : ""}`}>
                {qty}
              </span>
              {isLow && <IconAlertCircle className="h-4 w-4 text-red-500" />}
            </div>
          );
        },
      },
      {
        accessorKey: "lowStockAt",
        header: "Low Stock At",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.lowStockAt ? `${row.original.lowStockAt} units` : "—"}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="font-medium">
            ${Number(row.original.price).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "warrantyMonths",
        header: "Warranty",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.warrantyMonths
              ? `${row.original.warrantyMonths} months`
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {row.original.location || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditClick(product)}
                aria-label={`Edit ${product.name}`}
              >
                <IconEdit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(product)}
                aria-label={`Delete ${product.name}`}
                disabled={deletingId === product.id}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deletingId, handleDeleteClick, handleEditClick]
  );

  const handleEditChange = React.useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = event.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEditSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!editProduct) return;

      startEditTransition(async () => {
        const formData = new FormData();
        formData.append("id", editProduct.id);
        Object.entries(editForm).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value);
          }
        });

        const result = await updateProduct(formData);
        if (result?.success) {
          toast.success(result.message ?? "Product updated successfully.");
          setIsEditOpen(false);
          setEditProduct(null);
        } else if (result?.errors) {
          toast.error(result.message ?? "Validation failed.");
        } else {
          toast.error(result?.message ?? "Failed to update product.");
        }
      });
    },
    [editForm, editProduct]
  );

  const table = useReactTable({
    data: filteredItems,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const lowStockItems = filteredItems.filter((item) => {
    const lowThreshold =
      item.lowStockAt == null ? undefined : Number(item.lowStockAt);
    return (
      typeof lowThreshold === "number" && Number(item.quantity) <= lowThreshold
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name, SKU, category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination({ ...pagination, pageIndex: 0 });
          }}
          className="max-w-sm"
        />
      </div>

      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <IconAlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""}{" "}
            below low stock threshold
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Product>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Product, unknown>) => (
                  <TableHead key={header.id} className="font-semibold">
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
              table.getRowModel().rows.map((row: Row<Product>) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/70"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: Cell<Product, unknown>) => (
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {(() => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const total = table.getFilteredRowModel().rows.length;
            if (total === 0) {
              return "Showing 0 products";
            }
            const start = pageIndex * pageSize + 1;
            const end = start + table.getRowModel().rows.length - 1;
            return `Showing ${start}-${end} of ${total} products`;
          })()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
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
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl h-screen">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleEditSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={editForm.name ?? ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="sku">
                  SKU
                </label>
                <Input
                  id="sku"
                  name="sku"
                  value={editForm.sku ?? ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={editForm.category ?? ""}
                  onChange={handleEditChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="manufacturer">
                  Manufacturer
                </label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={editForm.manufacturer ?? ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="model">
                  Model
                </label>
                <Input
                  id="model"
                  name="model"
                  value={editForm.model ?? ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="condition">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={editForm.condition ?? "new"}
                  onChange={handleEditChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="quantity">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  required
                  value={editForm.quantity ?? "0"}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lowStockAt">
                  Low stock at
                </label>
                <Input
                  id="lowStockAt"
                  name="lowStockAt"
                  type="number"
                  min="0"
                  value={editForm.lowStockAt ?? ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="price">
                  Price
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editForm.price ?? "0"}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="location">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={editForm.location ?? ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="warrantyMonths">
                  Warranty (months)
                </label>
                <Input
                  id="warrantyMonths"
                  name="warrantyMonths"
                  type="number"
                  min="0"
                  value={editForm.warrantyMonths ?? ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="compatibility">
                Compatibility
              </label>
              <Textarea
                id="compatibility"
                name="compatibility"
                rows={2}
                value={editForm.compatibility ?? ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                value={editForm.notes ?? ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="supplier">
                Supplier
              </label>
              <Input
                id="supplier"
                name="supplier"
                value={editForm.supplier ?? ""}
                onChange={handleEditChange}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteDialogProduct)}
        onOpenChange={(open) => {
          if (!open && !isDeletingSelectedProduct) {
            setDeleteDialogProduct(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                {deleteDialogProduct?.name ?? "this product"}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialogProduct(null)}
              disabled={isDeletingSelectedProduct}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
              disabled={isDeletingSelectedProduct}
            >
              {isDeletingSelectedProduct ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
