import type React from "react";
import { auth } from "@/infrastructure/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { AddSupplierForm } from "@/components/supplier/add-supplier-form";
import { SupplierList } from "@/components/supplier/supplier-list";

export default async function SuppliersPage() {
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
        <SiteHeader title="Suppliers" />
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
              <p className="text-muted-foreground">
                Manage your inventory suppliers and vendor relationships
              </p>
            </div>

            <div className="grid gap-8">
              <AddSupplierForm />
              <SupplierList />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

