import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getYYYYMMDD(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function Page() {
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
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();
  const totalRevenue = products.reduce(
    (sum, prod) => sum + Number(prod.price) * prod.quantity,
    0
  );
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (prod) => prod.lowStockAt !== null && prod.quantity <= prod.lowStockAt
  ).length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentProducts = products.filter(
    (prod) => prod.createdAt > sevenDaysAgo
  ).length;

  // Inventory trend chart (90 days): sum price*quantity grouped by date
  const days = 90;
  const today = new Date();
  const dateSeries: { [date: string]: number } = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    dateSeries[getYYYYMMDD(d)] = 0;
  }
  for (const prod of products) {
    const date = getYYYYMMDD(prod.createdAt);
    if (dateSeries[date] !== undefined) {
      dateSeries[date] += Number(prod.price) * prod.quantity;
    }
  }
  const inventoryChartData = Object.entries(dateSeries).map(([date, value]) => ({ date, value }));

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar user={userSidebar} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                totalRevenue={totalRevenue}
                totalProducts={totalProducts}
                lowStockCount={lowStockCount}
                recentProducts={recentProducts}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive chartData={inventoryChartData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
