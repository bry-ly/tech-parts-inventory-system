/*
  Warnings:

  - You are about to drop the `batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_movement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."batch" DROP CONSTRAINT "batch_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."inventory_value" DROP CONSTRAINT "inventory_value_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_supplier" DROP CONSTRAINT "product_supplier_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_supplier" DROP CONSTRAINT "product_supplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_alert" DROP CONSTRAINT "stock_alert_acknowledgedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_alert" DROP CONSTRAINT "stock_alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_movement" DROP CONSTRAINT "stock_movement_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_movement" DROP CONSTRAINT "stock_movement_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_movement" DROP CONSTRAINT "stock_movement_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_movement" DROP CONSTRAINT "stock_movement_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."supplier" DROP CONSTRAINT "supplier_userId_fkey";

-- DropTable
DROP TABLE "public"."batch";

-- DropTable
DROP TABLE "public"."inventory_value";

-- DropTable
DROP TABLE "public"."product_supplier";

-- DropTable
DROP TABLE "public"."stock_alert";

-- DropTable
DROP TABLE "public"."stock_movement";

-- DropTable
DROP TABLE "public"."supplier";

-- CreateTable
CREATE TABLE "sale" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customer" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "paymentMethod" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_item" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "sale_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sale_invoiceNumber_key" ON "sale"("invoiceNumber");

-- CreateIndex
CREATE INDEX "sale_userId_createdAt_idx" ON "sale"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "sale_invoiceNumber_idx" ON "sale"("invoiceNumber");

-- CreateIndex
CREATE INDEX "sale_item_saleId_idx" ON "sale_item"("saleId");

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
