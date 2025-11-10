import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma/prisma";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { SectionCards } from "@/components/inventory/section-cards";
import { ChartAreaInteractive } from "@/components/inventory/chart-area-interactive";
import { IconCurrencyPeso } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Dashboard | Hardware Inventory Management",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const user = session.user;
  const userSidebar = {
    name: user.name ?? user.email ?? "User",
    email: user.email ?? "",
    avatar: user.image ?? "/avatars/placeholder.svg",
  };

  const userId = user.id;

  // Fetch only required fields for calculations
  const allProducts = await prisma.product.findMany({
    where: { userId },
    select: {
      price: true,
      quantity: true,
      lowStockAt: true,
      createdAt: true,
      category: true,
    },
  });

  // Calculate all metrics in a single pass
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const categories = new Set<string>();
  let totalProducts = 0;
  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let recentProductsCount = 0;
  let totalUnits = 0;

  for (const p of allProducts) {
    totalProducts++;
    totalInventoryValue += Number(p.price) * p.quantity;
    totalUnits += p.quantity;
    
    if (p.category) {
      categories.add(p.category);
    }
    
    const lowThreshold =
      p.lowStockAt == null ? undefined : Number(p.lowStockAt);
    if (typeof lowThreshold === "number" && p.quantity <= lowThreshold) {
      lowStockCount++;
    }
    
    if (new Date(p.createdAt) >= sevenDaysAgo) {
      recentProductsCount++;
    }
  }

  const categoriesCount = categories.size;

  // Generate simplified chart data
  const chartData = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (90 - i));
    return {
      date: date.toISOString().split("T")[0],
      value: totalInventoryValue,
    };
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={userSidebar} />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
              <p className="mt-1 text-muted-foreground">
                Here&apos;s an overview of your hardware inventory
              </p>
            </div>

            <SectionCards
              totalRevenue={totalInventoryValue}
              totalProducts={totalProducts}
              lowStockCount={lowStockCount}
              recentProducts={recentProductsCount}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ChartAreaInteractive chartData={chartData} />
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Product Price
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <IconCurrencyPeso className="size-4" />
                      {(totalInventoryValue / (totalProducts || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Total Units
                    </span>
                    <span className="font-semibold">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Categories
                    </span>
                    <span className="font-semibold">{categoriesCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
