"use client";

import type * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconShoppingCart,
  IconSettings,
  IconPlus,
  IconTruckDelivery,
  IconArrowsExchange,
  IconAlertTriangle,
  IconFileUpload,
  IconBell,
} from "@tabler/icons-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavQuickActions } from "@/components/layout/nav-quick-actions";
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
import { Cpu } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: IconShoppingCart,
      items: [
        {
          title: "All Products",
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
      ],
    },
    {
      title: "Supply Chain",
      url: "/suppliers",
      icon: IconTruckDelivery,
      items: [
        {
          title: "Suppliers",
          url: "/suppliers",
        },
        {
          title: "Stock Movements",
          url: "/stock-movements",
        },
      ],
    },
    {
      title: "Monitoring",
      url: "/alerts",
      icon: IconAlertTriangle,
      items: [
        {
          title: "Alerts",
          url: "/alerts",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
        {
          title: "Reports",
          url: "/reports",
        },
      ],
    },
  ],
  quickActions: [
    {
      name: "Add Product",
      url: "/add-product",
      icon: IconPlus,
    },
    {
      name: "Stock Movement",
      url: "/stock-movements",
      icon: IconArrowsExchange,
    },
    {
      name: "View Alerts",
      url: "/alerts",
      icon: IconBell,
    },
  ],
  navTools: [
    {
      title: "Import/Export",
      url: "/import-export",
      icon: IconFileUpload,
    },
  ],
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
                <Cpu className="size-5!" />
                <span className="text-base font-semibold">Tech Parts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavQuickActions items={data.quickActions} />
        <NavSecondary items={data.navTools} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
