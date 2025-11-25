import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { getSalesAnalytics, getRecentSales } from "@/lib/action/sales";
import { SalesSummary } from "@/components/reports/sales-summary";
import { SalesChart } from "@/components/reports/sales-chart";
import { RecentSalesTable } from "@/components/reports/recent-sales-table";

export default async function SalesReportPage() {
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

  const [analyticsResult, recentSalesResult] = await Promise.all([
    getSalesAnalytics("30d"),
    getRecentSales(5),
  ]);

  const analytics = (analyticsResult.data as {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    chartData: { date: string; amount: number }[];
  }) || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    chartData: [],
  };

  const recentSales = recentSalesResult.data || [];

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
        <SiteHeader title="Sales Report" />
        <main className="flex-1 overflow-auto p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Sales Report</h1>
            <p className="text-muted-foreground">
              Overview of your sales performance for the last 30 days.
            </p>
          </div>

          <SalesSummary
            totalRevenue={analytics.totalRevenue}
            totalOrders={analytics.totalOrders}
            averageOrderValue={analytics.averageOrderValue}
          />

          <div className="grid gap-4 md:grid-cols-7">
            <SalesChart data={analytics.chartData} />
            <RecentSalesTable sales={recentSales} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
