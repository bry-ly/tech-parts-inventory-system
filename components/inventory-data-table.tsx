"use client"

import * as React from "react"
import { DataTable, schema as BaseSchema } from "@/components/data-table"
import { z } from "zod"

type Product = {
  id: string
  name: string
  sku?: string | null
  price: string | number
  quantity: number
  lowStockAt?: number | null
  imageUrl?: string | null
}

// The DataTable expects items matching its schema: id:number, header, type, status, target, limit, reviewer
// We adapt Product -> DataTable schema here
function mapProductsToRows(products: Product[]) {
  return products.map((p, index) => {
    const qty = Number(p.quantity || 0)
    const low = p.lowStockAt == null ? undefined : Number(p.lowStockAt)
    const isLow = typeof low === "number" && qty <= low

    return {
      id: index + 1, // DataTable requires numeric id; stable enough for view
      header: p.name,
      type: p.sku ? String(p.sku) : "N/A",
      status: isLow ? "Low" : "In Stock",
      target: String(qty),
      limit: low == null ? "-" : String(low),
      reviewer: `$${Number(p.price).toFixed(2)}`,
      // Keep original for potential client-side usage (not used by DataTable columns currently)
      _productId: p.id,
      _imageUrl: p.imageUrl || "/placeholder.svg",
    }
  }) as Array<z.infer<typeof BaseSchema> & { _productId: string; _imageUrl: string }>
}

export function InventoryDataTable({ items }: { items: Product[] }) {
  const data = React.useMemo(() => mapProductsToRows(items), [items])
  return <DataTable data={data} />
}


