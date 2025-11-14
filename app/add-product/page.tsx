import type React from "react";
import { auth } from "@/infrastructure/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { AddProductForm } from "@/components/product/add-product-form";
import { prisma } from "@/infrastructure/database/prisma.repository";

export const metadata = {
  title: "Dashboard | Add Product",
};

export default async function AddProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const user = session.user;
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
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
      <AppSidebar user={userSidebar} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-accent-foreground">
              Add Product
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Complete the form below to add a new product to your inventory.
              Use categories to organize items efficiently.
            </p>
          </div>
          <div className="max-w-4xl justify-center mx-auto">
            <AddProductForm categories={categoryOptions} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
