import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { AddProductForm } from "@/components/product/add-product-form";

export const metadata = {
  title: "Dashboard | Add Product",
};

export default async function AddProductPage() {
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
              Add Hardware Component
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Complete the form below to add a new component to your inventory.
              Use categories to organize items efficiently.
            </p>
          </div>
          <div className="max-w-4xl">
            <AddProductForm />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
