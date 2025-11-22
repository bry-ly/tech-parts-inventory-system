import React, { Suspense } from "react";
import { DemoSidebar } from "@/components/layout/demo-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { SectionCards } from "@/components/inventory/section-cards";
import { ChartAreaInteractive } from "@/components/inventory/chart-area-interactive";
import { CategoryBreakdownChart } from "@/components/inventory/category-breakdown-chart";
import { ManufacturerBreakdownChart } from "@/components/inventory/manufacturer-breakdown-chart";
import { IconCurrencyPeso } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo Dashboard | Hardware Inventory Management",
};

// Demo data
const demoData = {
  totalProducts: 127,
  totalInventoryValue: 2456789.5,
  lowStockCount: 8,
  recentProducts: 12,
  totalUnits: 3420,
  uniqueCategories: 15,
  avgProductPrice: 718.36,
};

// Generate demo chart data for the last 90 days
const generateDemoChartData = () => {
  const days = 90;
  const chartData: { date: string; value: number }[] = [];
  const currentDate = new Date();
  const baseValue = 1500000;

  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (days - i - 1));
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];

    // Simulate gradual growth with some variation
    const progress = i / days;
    const variation = Math.sin(progress * Math.PI * 4) * 50000;
    const value = baseValue + progress * 1000000 + variation;

    chartData.push({
      date: dateStr,
      value: Math.max(0, value),
    });
  }

  return chartData;
};

// Demo category breakdown
const demoCategoryBreakdown = [
  { category: "Processors", count: 25, value: 625000 },
  { category: "Graphics Cards", count: 18, value: 540000 },
  { category: "Motherboards", count: 22, value: 330000 },
  { category: "Memory", count: 30, value: 240000 },
  { category: "Storage", count: 20, value: 180000 },
  { category: "Power Supplies", count: 12, value: 541789.5 },
];

// Demo manufacturer breakdown
const demoManufacturerBreakdown = [
  { manufacturer: "Intel", count: 35, value: 875000 },
  { manufacturer: "AMD", count: 28, value: 700000 },
  { manufacturer: "NVIDIA", count: 15, value: 450000 },
  { manufacturer: "ASUS", count: 20, value: 300000 },
  { manufacturer: "Corsair", count: 18, value: 131789.5 },
  { manufacturer: "Samsung", count: 11, value: 0 },
];

const demoUser = {
  name: "Demo User",
  email: "demo@example.com",
  avatar: "/icon.png",
};

export default function DemoDashboardPage() {
  const chartData = generateDemoChartData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DemoSidebar user={demoUser} />
      <SidebarInset>
        <SiteHeader title="Demo Dashboard" />
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href="/">
                    <ArrowLeft className="size-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold">
                Welcome to the Demo Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                This is a preview of the inventory management system with sample
                data
              </p>
            </div>

            <SectionCards
              totalRevenue={demoData.totalInventoryValue}
              totalProducts={demoData.totalProducts}
              lowStockCount={demoData.lowStockCount}
              recentProducts={demoData.recentProducts}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Suspense fallback={<div>Loading chart...</div>}>
                  <ChartAreaInteractive chartData={chartData} />
                </Suspense>
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
                      {demoData.avgProductPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">
                      Total Units
                    </span>
                    <span className="font-semibold">
                      {demoData.totalUnits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Categories
                    </span>
                    <span className="font-semibold">
                      {demoData.uniqueCategories}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <CategoryBreakdownChart data={demoCategoryBreakdown} />
              <ManufacturerBreakdownChart data={demoManufacturerBreakdown} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
