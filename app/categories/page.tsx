import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { CategoryManager } from "@/components/inventory/category-manager";
import { prisma } from "@/lib/prisma/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Categories | Hardware Management",
};

export default async function CategoriesPage() {
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

  const [categories, totalProducts] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.count({
      where: { userId: user.id },
    }),
  ]);

  const categorizedProducts = categories.reduce(
    (sum, category) => sum + category._count.products,
    0
  );
  const uncategorizedProducts = totalProducts - categorizedProducts;

  const categorySummaries = categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Categories</h1>
                <p className="text-muted-foreground">
                  Create, rename, or delete categories to keep your inventory organized.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  Total: {categorySummaries.length}
                </Badge>
                <Badge variant="outline">
                  Categorized: {categorizedProducts}
                </Badge>
                <Badge variant="outline">
                  Uncategorized: {Math.max(uncategorizedProducts, 0)}
                </Badge>
              </div>
            </div>

            <CategoryManager categories={categorySummaries} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


