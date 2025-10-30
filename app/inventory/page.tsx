import { Pagination } from "@/components/ui/pagination";
import { deleteProduct } from "@/lib/action/product";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { InventoryDataTable } from "@/components/inventory-data-table";

export const metadata: Metadata = {
    title: "Inventory"
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
  const prisma = new PrismaClient();
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number(resolvedParams?.page ?? 1));
  const pageSize = 5;
  const qVal = resolvedParams?.q ?? "";
  const q = Array.isArray(qVal) ? qVal[0]?.trim() : qVal.trim();
  const [totalCount, itemsRaw] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: pageSize,
    }),
  ]);

  const items = itemsRaw.map((p: any) => ({
    ...p,
    price: Number(p.price),
  }));

  const totalPages = Math.max(
    1,
    Math.ceil(Number(totalCount) / Number(pageSize))
  );

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar user={userSidebar} />
      <SidebarInset>
        <SiteHeader />
        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Inventory
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your products and track inventory levels.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <InventoryDataTable items={items as any} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
