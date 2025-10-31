import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { InventoryDataTable } from "@/components/inventory/inventory-data-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma/prisma";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inventory | Hardware Management",
};

export default async function InventoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const user = session.user;
  const userSidebar = {
    name: user.name ?? user.email ?? "User",
    email: user.email ?? "",
    avatar: user.image ?? "/avatars/shadcn.jpg",
  };

  const userId = user.id;

  const allProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const items = allProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

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
        <SiteHeader />
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage your tech hardware inventory and track stock levels
                </p>
              </div>
              <Link href="/add-product">
                <Button className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="border-b border-border p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  All Products
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete inventory of all hardware components
                </p>
              </div>
              <div className="p-6">
                <InventoryDataTable items={items} />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
