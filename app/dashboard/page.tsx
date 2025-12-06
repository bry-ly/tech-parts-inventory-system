import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { SectionCards } from "@/components/inventory/section-cards";
import { ChartAreaInteractive } from "@/components/inventory/chart-area-interactive";
import { CategoryBreakdownChart } from "@/components/inventory/category-breakdown-chart";
import { ManufacturerBreakdownChart } from "@/components/inventory/manufacturer-breakdown-chart";
import { IconCurrencyPeso } from "@tabler/icons-react";
import { getDashboardMetrics } from "@/lib/server/dashboard-metrics";

export const metadata: Metadata = {
  title: "Dashboard | Hardware Inventory Management",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;
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

  // Get optimized dashboard metrics using aggregates and caching
  const metrics = await getDashboardMetrics(userId);

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
                Here&apos;s an overview of your inventory
              </p>
            </div>

            <SectionCards
              totalRevenue={metrics.totalInventoryValue}
              totalProducts={metrics.totalProducts}
              lowStockCount={metrics.lowStockCount}
              recentProducts={metrics.recentProductsCount}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ChartAreaInteractive
                  chartData={metrics.chartData}
                  dateRange={(searchParams.dateRange as string) || "90d"}
                />
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Unit Price
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <IconCurrencyPeso className="size-4" />
                      {metrics.avgProductPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Total Units
                    </span>
                    <span className="font-semibold">
                      {metrics.totalUnits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Categories
                    </span>
                    <span className="font-semibold">{metrics.uniqueCategories}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <CategoryBreakdownChart
                data={Object.entries(metrics.categoryBreakdown).map(
                  ([category, data]) => ({
                    category,
                    count: data.count,
                    value: data.value,
                  })
                )}
              />
              <ManufacturerBreakdownChart
                data={Object.entries(metrics.manufacturerBreakdown).map(
                  ([manufacturer, data]) => ({
                    manufacturer,
                    count: data.count,
                    value: data.value,
                  })
                )}
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
