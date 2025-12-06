import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import type { Product } from "@/lib/types";

export interface ProductQueryResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: {
    search?: string;
    category?: string;
    manufacturer?: string;
    condition?: string;
    lowStock?: boolean;
    sort?: string;
  };
}

export interface ProductQueryParams {
  userId: string;
  search?: string;
  category?: string;
  manufacturer?: string;
  condition?: string;
  lowStock?: string | boolean;
  page?: string | number;
  pageSize?: string | number;
  sort?: string;
}

/**
 * Build Prisma where clause from search params
 */
function buildWhereClause(params: ProductQueryParams): Prisma.ProductWhereInput {
  const { userId, search, category, manufacturer, condition, lowStock } = params;
  
  let where: Prisma.ProductWhereInput = { userId };
  
  // Search filter - search across name, sku, manufacturer, and category name
  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { manufacturer: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  
  // Category filter
  if (category && category !== "all" && category !== "__uncategorized") {
    where.categoryId = category;
  } else if (category === "__uncategorized") {
    where.categoryId = null;
  }
  
  // Manufacturer filter
  if (manufacturer && manufacturer !== "all") {
    where.manufacturer = manufacturer;
  }
  
  // Condition filter
  if (condition && condition !== "all") {
    where.condition = condition;
  }
  
  // Low stock filter
  if (lowStock === true || lowStock === "true") {
    where.AND = [
      ...(where.AND || []),
      {
        AND: [
          { lowStockAt: { not: null } },
          { quantity: { lte: { reference: "lowStockAt", path: [] } } },
        ],
      },
    ];
  }
  
  return where;
}

/**
 * Build Prisma orderBy clause from sort param
 */
function buildOrderByClause(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  if (!sort || sort === "createdAt-desc") {
    return [{ createdAt: "desc" }];
  }
  
  const [field, direction] = sort.split("-");
  const dir = direction === "asc" ? "asc" : "desc";
  
  const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    name: { name: dir },
    sku: { sku: dir },
    manufacturer: { manufacturer: dir },
    model: { model: dir },
    condition: { condition: dir },
    quantity: { quantity: dir },
    price: { price: dir },
    updatedAt: { updatedAt: dir },
    createdAt: { createdAt: dir },
  };
  
  return [orderByMap[field] || { createdAt: "desc" }];
}

/**
 * Query products with pagination and filtering
 */
export async function queryProducts(params: ProductQueryParams): Promise<ProductQueryResult> {
  const { page = 0, pageSize = 12 } = params;
  
  // Parse and validate pagination params
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : page;
  const parsedPageSize = typeof pageSize === "string" ? parseInt(pageSize, 10) : pageSize;
  
  const validPage = Math.max(0, parsedPage);
  const validPageSize = Math.min(100, Math.max(1, parsedPageSize));
  
  const where = buildWhereClause(params);
  const orderBy = buildOrderByClause(params.sort);
  
  // Execute both queries in a transaction for consistency
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip: validPage * validPageSize,
      take: validPageSize,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);
  
  // Transform to Product type
  const items: Product[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    manufacturer: product.manufacturer,
    model: product.model,
    condition: product.condition,
    price: Number(product.price),
    quantity: product.quantity,
    lowStockAt: product.lowStockAt,
    supplier: product.supplier,
    imageUrl: product.imageUrl,
    warrantyMonths: product.warrantyMonths,
    location: product.location,
    compatibility: product.compatibility,
    notes: product.notes,
    userId: product.userId,
    createdAt: product.createdAt.toISOString(),
    tags: product.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
  }));
  
  const totalPages = Math.ceil(total / validPageSize);
  
  return {
    items,
    total,
    page: validPage,
    pageSize: validPageSize,
    totalPages,
    filters: {
      search: params.search || undefined,
      category: params.category || undefined,
      manufacturer: params.manufacturer || undefined,
      condition: params.condition || undefined,
      lowStock: params.lowStock === "true" || params.lowStock === true,
      sort: params.sort || undefined,
    },
  };
}

/**
 * Query all manufacturers for filter dropdown
 */
export async function queryManufacturers(userId: string): Promise<string[]> {
  const manufacturers = await prisma.product.findMany({
    where: { userId },
    select: { manufacturer: true },
    distinct: ["manufacturer"],
    orderBy: { manufacturer: "asc" },
  });
  
  return manufacturers
    .map((m) => m.manufacturer)
    .filter(Boolean) as string[];
}

/**
 * Query all products for export (no pagination)
 */
export async function queryAllProductsForExport(
  params: Omit<ProductQueryParams, "page" | "pageSize">
): Promise<Product[]> {
  const where = buildWhereClause(params);
  const orderBy = buildOrderByClause(params.sort);
  
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  
  // Transform to Product type
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    manufacturer: product.manufacturer,
    model: product.model,
    condition: product.condition,
    price: Number(product.price),
    quantity: product.quantity,
    lowStockAt: product.lowStockAt,
    supplier: product.supplier,
    imageUrl: product.imageUrl,
    warrantyMonths: product.warrantyMonths,
    location: product.location,
    compatibility: product.compatibility,
    notes: product.notes,
    userId: product.userId,
    createdAt: product.createdAt.toISOString(),
    tags: product.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
  }));
}