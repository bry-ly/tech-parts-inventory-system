import type React from "react";
import { auth } from "@/infrastructure/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { LowStockReport } from "@/components/reports/low-stock-report";
import { TopProductsReport } from "@/components/reports/top-products-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ReportsPage() {
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
        <SiteHeader title="Reports" />
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">
                Detailed inventory reports and insights
              </p>
            </div>

            <Tabs defaultValue="low-stock" className="space-y-4">
              <TabsList>
                <TabsTrigger value="low-stock">Stock Alerts</TabsTrigger>
                <TabsTrigger value="top-products">Top Products</TabsTrigger>
              </TabsList>

              <TabsContent value="low-stock">
                <LowStockReport />
              </TabsContent>

              <TabsContent value="top-products">
                <TopProductsReport />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

