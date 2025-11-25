/**
 * Product name cell component for inventory table
 * Displays product image/icon, name, and SKU
 */

import Image from "next/image";
import Link from "next/link";
import { IconPackage } from "@tabler/icons-react";
import type { Product } from "@/lib/types";

interface ProductNameCellProps {
  product: Product;
}

export function ProductNameCell({ product }: ProductNameCellProps) {
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
        <Link
          href={`/inventory/${product.id}`}
          className="font-medium text-primary hover:underline"
        >
          {product.name}
        </Link>
        {product.sku && (
          <span className="text-xs text-muted-foreground">
            SKU: {product.sku}
          </span>
        )}
      </div>
    </div>
  );
}
