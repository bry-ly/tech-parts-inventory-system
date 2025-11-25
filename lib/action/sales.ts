"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma/prisma";
import { logActivity } from "@/lib/logger/logger";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function getSalesAnalytics(
  dateRange: "7d" | "30d" | "90d" = "30d"
) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  const now = new Date();
  const startDate = new Date();

  if (dateRange === "7d") {
    startDate.setDate(now.getDate() - 7);
  } else if (dateRange === "30d") {
    startDate.setDate(now.getDate() - 30);
  } else {
    startDate.setDate(now.getDate() - 90);
  }

  try {
    const sales = await prisma.sale.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
        },
        status: "completed",
      },
      include: {
        items: true,
      },
    });

    const totalRevenue = sales.reduce(
      (acc, sale) => acc + Number(sale.totalAmount),
      0
    );
    const totalOrders = sales.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const salesByDate = sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + Number(sale.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(salesByDate)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        chartData,
      },
    };
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    return {
      success: false,
      message: "Failed to fetch sales analytics",
      data: null,
    };
  }
}

export async function getRecentSales(limit = 5) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: [],
    };
  }

  try {
    const sales = await prisma.sale.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        items: true,
      },
    });

    // Convert Decimal fields to numbers for client component compatibility
    const serializedSales = sales.map((sale) => ({
      ...sale,
      subtotal: sale.subtotal.toNumber(),
      discount: sale.discount.toNumber(),
      tax: sale.tax.toNumber(),
      totalAmount: sale.totalAmount.toNumber(),
      items: sale.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        discount: item.discount.toNumber(),
        subtotal: item.subtotal.toNumber(),
        totalPrice: item.totalPrice.toNumber(),
      })),
    }));

    return {
      success: true,
      data: serializedSales,
    };
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return {
      success: false,
      message: "Failed to fetch recent sales",
      data: [],
    };
  }
}

// Generate unique invoice number
async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `INV-${year}${month}${day}`;

  // Find the latest invoice for today
  const latestInvoice = await prisma.sale.findFirst({
    where: {
      invoiceNumber: {
        startsWith: datePrefix,
      },
    },
    orderBy: {
      invoiceNumber: "desc",
    },
  });

  let counter = 1;
  if (latestInvoice) {
    // Extract counter from last invoice (e.g., INV-20251125-0005 -> 5)
    const lastCounter = parseInt(
      latestInvoice.invoiceNumber.split("-").pop() || "0"
    );
    counter = lastCounter + 1;
  }

  return `${datePrefix}-${String(counter).padStart(4, "0")}`;
}

export async function createSale(data: {
  items: {
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
  }[];
  customer?: string;
  paymentMethod?: string;
  overallDiscount?: number;
  taxRate?: number;
  notes?: string;
}) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  if (!data.items || data.items.length === 0) {
    return {
      success: false,
      message: "No items in sale",
    };
  }

  try {
    // Calculate item subtotals and apply item discounts
    const itemsWithCalculations = data.items.map((item) => {
      const subtotal = item.price * item.quantity;
      const itemDiscount = item.discount || 0;
      const totalPrice = subtotal - itemDiscount;
      return {
        ...item,
        subtotal,
        discount: itemDiscount,
        totalPrice,
      };
    });

    // Calculate overall subtotal
    const subtotal = itemsWithCalculations.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // Apply overall discount and tax
    const overallDiscount = data.overallDiscount || 0;
    const subtotalAfterDiscount = subtotal - overallDiscount;
    const taxRate = data.taxRate || 0;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);
    const totalAmount = subtotalAfterDiscount + taxAmount;

    // Generate unique invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Verify stock and get product details
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        userId: user.id,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Check if all products exist and have enough stock
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return {
          success: false,
          message: `Product not found: ${item.productId}`,
        };
      }
      if (product.quantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        };
      }
    }

    // Create sale and update stock in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create Sale
      const newSale = await tx.sale.create({
        data: {
          userId: user.id,
          invoiceNumber,
          customer: data.customer,
          paymentMethod: data.paymentMethod,
          subtotal,
          discount: overallDiscount,
          tax: taxAmount,
          totalAmount,
          notes: data.notes,
          status: "completed",
        },
      });

      // Create Sale Items and Update Stock
      for (const itemCalc of itemsWithCalculations) {
        const product = productMap.get(itemCalc.productId)!;

        // Create Sale Item
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: itemCalc.productId,
            productName: product.name,
            quantity: itemCalc.quantity,
            unitPrice: itemCalc.price,
            discount: itemCalc.discount,
            subtotal: itemCalc.subtotal,
            totalPrice: itemCalc.totalPrice,
          },
        });

        // Decrement Stock
        await tx.product.update({
          where: { id: itemCalc.productId },
          data: {
            quantity: {
              decrement: itemCalc.quantity,
            },
          },
        });
      }

      return newSale;
    });

    // Log activity
    await logActivity({
      userId: user.id,
      actorId: user.id,
      entityType: "sale",
      entityId: sale.id,
      action: "create",
      changes: {
        invoiceNumber: sale.invoiceNumber,
        totalAmount: sale.totalAmount.toNumber(),
        customer: sale.customer,
        itemsCount: data.items.length,
      },
      note: `Created sale ${sale.invoiceNumber}`,
    });

    return {
      success: true,
      message: "Sale created successfully",
      data: {
        saleId: sale.id,
        invoiceNumber: sale.invoiceNumber,
      },
    };
  } catch (error) {
    console.error("Error creating sale:", error);
    return {
      success: false,
      message: "Failed to create sale",
    };
  }
}

// Get complete sale details for receipt
export async function getSaleDetails(saleId: string) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  try {
    const sale = await prisma.sale.findUnique({
      where: {
        id: saleId,
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (!sale) {
      return {
        success: false,
        message: "Sale not found",
        data: null,
      };
    }

    // Convert Decimal fields to numbers
    const serializedSale = {
      ...sale,
      subtotal: sale.subtotal.toNumber(),
      discount: sale.discount.toNumber(),
      tax: sale.tax.toNumber(),
      totalAmount: sale.totalAmount.toNumber(),
      items: sale.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        discount: item.discount.toNumber(),
        subtotal: item.subtotal.toNumber(),
        totalPrice: item.totalPrice.toNumber(),
      })),
    };

    return {
      success: true,
      data: serializedSale,
    };
  } catch (error) {
    console.error("Error fetching sale details:", error);
    return {
      success: false,
      message: "Failed to fetch sale details",
      data: null,
    };
  }
}
