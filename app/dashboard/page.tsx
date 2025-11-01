import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { SectionCards } from "@/components/inventory/section-cards";
import { ChartAreaInteractive } from "@/components/inventory/chart-area-interactive";

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
  const prisma = new PrismaClient();

  const allProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalProducts = allProducts.length;
  const totalInventoryValue = allProducts.reduce(
    (sum, p) => sum + Number(p.price) * p.quantity,
    0
  );
  const lowStockCount = allProducts.filter((p) => {
    const lowThreshold =
      p.lowStockAt == null ? undefined : Number(p.lowStockAt);
    return (
      typeof lowThreshold === "number" && Number(p.quantity) <= lowThreshold
    );
  }).length;

  const recentProductsCount = allProducts.filter((p) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(p.createdAt) >= sevenDaysAgo;
  }).length;

  // Generate mock chart data for the last 90 days
  const chartData = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (90 - i));
    return {
      date: date.toISOString().split("T")[0],
      value:
        Math.floor(Math.random() * totalInventoryValue * 0.5) +
        totalInventoryValue * 0.5,
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
                    <span className="font-semibold">
                      ${(totalInventoryValue / (totalProducts || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Total Units
                    </span>
                    <span className="font-semibold">
                      {allProducts.reduce((sum, p) => sum + p.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Categories
                    </span>
                    <span className="font-semibold">
                      {
                        new Set(
                          allProducts.map((p) => p.category).filter(Boolean)
                        ).size
                      }
                    </span>
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
