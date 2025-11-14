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
  IconUpload,
  IconX,
  IconCurrencyPeso,
  IconDownload,
  IconFilter,
  IconPlus,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteProduct, updateProduct, adjustStock } from "@/application/actions/product.actions";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
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
  createdAt: string;
}

const CONDITIONS = ["new", "used", "refurbished", "for-parts"] as const;

const CONDITION_BADGES: Record<string, string> = {
  new: "bg-green-50 text-green-700",
  refurbished: "bg-blue-50 text-blue-700",
  used: "bg-yellow-50 text-yellow-700",
  "for-parts": "bg-orange-50 text-orange-700",
};

type CategoryOption = {
  id: string;
  name: string;
};

export function InventoryDataTable({
  items,
  categories,
}: {
  items: Product[];
  categories: CategoryOption[];
}) {
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
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [manufacturerFilter, setManufacturerFilter] = React.useState<string>("all");
  const [conditionFilter, setConditionFilter] = React.useState<string>("all");
  const [lowStockFilter, setLowStockFilter] = React.useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [editForm, setEditForm] = React.useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, startEditTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteDialogProduct, setDeleteDialogProduct] =
    React.useState<Product | null>(null);
  const [stockAdjustmentOpen, setStockAdjustmentOpen] =
    React.useState<string | null>(null);
  const [stockAdjustmentValue, setStockAdjustmentValue] =
    React.useState<string>("");
  const [adjustingStockId, setAdjustingStockId] =
    React.useState<string | null>(null);

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
      imageUrl: product.imageUrl ?? "",
    });
    setImagePreview(product.imageUrl ?? null);
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

  // Get unique manufacturers for filter
  const uniqueManufacturers = React.useMemo(() => {
    const manufacturers = new Set(
      items.map((item) => item.manufacturer).filter(Boolean)
    );
    return Array.from(manufacturers).sort();
  }, [items]);

  const filteredItems = React.useMemo(() => {
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
        filtered = filtered.filter((item) => item.categoryId === categoryFilter);
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

  // Export to CSV
  const handleExport = React.useCallback(() => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Manufacturer",
      "Model",
      "Condition",
      "Quantity",
      "Low Stock At",
      "Price",
      "Location",
      "Supplier",
      "Warranty (months)",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredItems.map((item) =>
        [
          `"${item.name}"`,
          `"${item.sku || ""}"`,
          `"${item.categoryName || "Uncategorized"}"`,
          `"${item.manufacturer || ""}"`,
          `"${item.model || ""}"`,
          `"${item.condition || ""}"`,
          item.quantity,
          item.lowStockAt || "",
          Number(item.price).toFixed(2),
          `"${item.location || ""}"`,
          `"${item.supplier || ""}"`,
          item.warrantyMonths || "",
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `inventory-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Inventory exported successfully");
  }, [filteredItems]);

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
                <div className="relative h-10 w-10 overflow-hidden rounded border">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                  <IconPackage className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-primary">{product.name}</span>
                {product.sku && (
                  <span className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>
          );
        },
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
          const isAdjusting = adjustingStockId === product.id;
          const isOpen = stockAdjustmentOpen === product.id;

          return (
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isLow ? "text-red-600" : ""}`}>
                {qty}
              </span>
              {isLow && <IconAlertCircle className="h-4 w-4 text-red-500" />}
              <Popover open={isOpen} onOpenChange={(open) => {
                if (!open) {
                  setStockAdjustmentOpen(null);
                  setStockAdjustmentValue("");
                } else {
                  setStockAdjustmentOpen(product.id);
                }
              }}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={isAdjusting}
                  >
                    <IconEdit className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Adjust Stock</h4>
                      <p className="text-xs text-muted-foreground">
                        Current quantity: {qty}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjustment">Adjustment Amount</Label>
                      <Input
                        id="adjustment"
                        type="number"
                        placeholder="e.g., +10 or -5"
                        value={stockAdjustmentValue}
                        onChange={(e) => setStockAdjustmentValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use positive numbers to add, negative to subtract
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const adjustment = Number(stockAdjustmentValue);
                          if (!isNaN(adjustment) && adjustment !== 0) {
                            setAdjustingStockId(product.id);
                            startEditTransition(async () => {
                              const formData = new FormData();
                              formData.append("id", product.id);
                              formData.append("adjustment", String(adjustment));
                              try {
                                const result = await adjustStock(formData);
                                if (result?.success) {
                                  toast.success(result.message ?? "Stock adjusted successfully.");
                                  setStockAdjustmentOpen(null);
                                  setStockAdjustmentValue("");
                                } else {
                                  toast.error(result?.message ?? "Failed to adjust stock.");
                                }
                              } catch {
                                toast.error("Failed to adjust stock.");
                              } finally {
                                setAdjustingStockId(null);
                              }
                            });
                          } else {
                            toast.error("Please enter a valid adjustment amount.");
                          }
                        }}
                        disabled={isAdjusting || !stockAdjustmentValue}
                        className="flex-1"
                      >
                        {isAdjusting ? "Adjusting..." : "Apply"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStockAdjustmentOpen(null);
                          setStockAdjustmentValue("");
                        }}
                        disabled={isAdjusting}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setStockAdjustmentValue("+1")}
                      >
                        <IconPlus className="h-3 w-3 mr-1" />
                        +1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setStockAdjustmentValue("+5")}
                      >
                        <IconPlus className="h-3 w-3 mr-1" />
                        +5
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setStockAdjustmentValue("+10")}
                      >
                        <IconPlus className="h-3 w-3 mr-1" />
                        +10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setStockAdjustmentValue("-1")}
                      >
                        -1
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
          <span className="font-medium flex items-center gap-1">
            <IconCurrencyPeso className="size-4" />
            {Number(row.original.price).toFixed(2)}
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
    [
      deletingId,
      handleDeleteClick,
      handleEditClick,
      adjustingStockId,
      stockAdjustmentOpen,
      stockAdjustmentValue,
    ]
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

  const handleImageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setEditForm((prev) => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveImage = React.useCallback(() => {
    setImagePreview(null);
    setEditForm((prev) => ({ ...prev, imageUrl: "" }));
  }, []);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination({ ...pagination, pageIndex: 0 });
          }}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2 sm:self-end">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm"
          >
            All Products
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              {items.length}
            </span>
          </Badge>
          {filteredItems.length !== items.length && (
            <Badge
              variant="secondary"
              className="flex items-center gap-2 rounded-full px-3 py-1 text-sm"
            >
              Showing
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10 text-secondary-foreground">
                {filteredItems.length}
              </span>
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={lowStockFilter ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setLowStockFilter(!lowStockFilter);
            setPagination({ ...pagination, pageIndex: 0 });
          }}
          className="gap-2"
        >
          <IconAlertCircle className="h-4 w-4" />
          Low Stock
        </Button>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setPagination({ ...pagination, pageIndex: 0 });
          }}
        >
          <SelectTrigger className="h-9 min-w-[140px] justify-between">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="__uncategorized">Uncategorized</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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
          <SelectTrigger className="h-9 min-w-[140px] justify-between">
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {uniqueManufacturers.map((manufacturer) => (
              <SelectItem
                key={manufacturer ?? "Unknown"}
                value={manufacturer ?? "Unknown"}
              >
                {manufacturer}
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
          <SelectTrigger className="h-9 min-w-[140px] justify-between">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {CONDITIONS.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 col-span-2 justify-end flex-1 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <IconFilter className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
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
          <Button className="gap-2" onClick={handleExport}>
            <IconDownload className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <IconAlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""}{" "}
            below low stock threshold
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Product>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<Product, unknown>) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )}
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
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 overflow-y-auto flex-1 pr-2"
            onSubmit={handleEditSubmit}
          >
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Image</label>
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-lg border-2 border-dashed border-border overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload-edit"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IconUpload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload product image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, or WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload-edit"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="categoryId">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={editForm.categoryId ?? ""}
                  onChange={handleEditChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="price">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <IconCurrencyPeso className="size-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="pl-9"
                    value={editForm.price ?? "0"}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
            </div>

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="notes">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                rows={2}
                value={editForm.notes ?? ""}
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
              <span className="font-medium text-primary">
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
