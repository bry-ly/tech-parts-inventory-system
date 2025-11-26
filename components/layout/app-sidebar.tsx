"use client";
import type * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconShoppingCart,
  IconSettings,
  IconPackages,
  IconTrendingUp,
  IconChartBar,
} from "@tabler/icons-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products / Inventory",
      url: "#",
      icon: IconShoppingCart,
      items: [
        {
          title: "Product List",
          url: "/inventory",
        },
        {
          title: "Add Product",
          url: "/add-product",
        },
        {
          title: "Categories",
          url: "/categories",
        },
        {
          title: "Tags",
          url: "/tags",
        },
      ],
    },
    {
      title: "Stock Management",
      url: "#",
      icon: IconPackages,
      items: [
        {
          title: "Stock Adjustment",
          url: "/stock/adjustment",
        },
        {
          title: "Low Stock Alerts",
          url: "/stock/alerts",
        },
      ],
    },
    {
      title: "Sales / Outbound",
      url: "#",
      icon: IconTrendingUp,
      items: [
        {
          title: "Create Sale",
          url: "/sales/create",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Inventory Report",
          url: "/reports/inventory",
        },
        {
          title: "Sales Report",
          url: "/reports/sales",
        },
        {
          title: "Activity Log",
          url: "/activity-log",
        },
      ],
    },
  ],
  NavDocuments: [],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

interface AppSidebarProps {
  user: { name: string; email: string; avatar: string };
}

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Image
                  src="/icon.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="size-5!"
                />
                <span className="text-base font-semibold">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
