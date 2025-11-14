/*
  Warnings:

  - You are about to drop the `email` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."email";

-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_supplier" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierSku" TEXT,
    "costPrice" DECIMAL(12,2) NOT NULL,
    "leadTimeDays" INTEGER,
    "minOrderQty" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT,
    "batchId" TEXT,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousQty" INTEGER NOT NULL,
    "newQty" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,2),
    "totalCost" DECIMAL(12,2),
    "reference" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "manufacturedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "threshold" INTEGER,
    "currentValue" INTEGER,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "stock_alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_value" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalProducts" INTEGER NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "totalValue" DECIMAL(15,2) NOT NULL,
    "lowStockCount" INTEGER NOT NULL,
    "outOfStockCount" INTEGER NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_value_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplier_userId_active_idx" ON "supplier"("userId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_userId_email_key" ON "supplier"("userId", "email");

-- CreateIndex
CREATE INDEX "product_supplier_supplierId_idx" ON "product_supplier"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "product_supplier_productId_supplierId_key" ON "product_supplier"("productId", "supplierId");

-- CreateIndex
CREATE INDEX "stock_movement_userId_productId_createdAt_idx" ON "stock_movement"("userId", "productId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movement_type_idx" ON "stock_movement"("type");

-- CreateIndex
CREATE INDEX "stock_movement_createdAt_idx" ON "stock_movement"("createdAt");

-- CreateIndex
CREATE INDEX "batch_userId_expiresAt_idx" ON "batch"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "batch_userId_productId_batchNumber_key" ON "batch"("userId", "productId", "batchNumber");

-- CreateIndex
CREATE INDEX "stock_alert_userId_acknowledged_type_idx" ON "stock_alert"("userId", "acknowledged", "type");

-- CreateIndex
CREATE INDEX "stock_alert_createdAt_idx" ON "stock_alert"("createdAt");

-- CreateIndex
CREATE INDEX "inventory_value_userId_snapshotDate_idx" ON "inventory_value"("userId", "snapshotDate");

-- AddForeignKey
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_supplier" ADD CONSTRAINT "product_supplier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_supplier" ADD CONSTRAINT "product_supplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alert" ADD CONSTRAINT "stock_alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alert" ADD CONSTRAINT "stock_alert_acknowledgedBy_fkey" FOREIGN KEY ("acknowledgedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_value" ADD CONSTRAINT "inventory_value_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
