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

import { NavUser } from "@/components/layout/nav-user";
import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

interface DemoSidebarProps {
  user: { name: string; email: string; avatar: string };
}

export function DemoSidebar({
  user,
  ...props
}: DemoSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    // Allow navigation to demo page itself
    if (url === "/demo" || url === "/") {
      return;
    }
    // Prevent navigation and show dialog for all other links
    e.preventDefault();
    setDialogOpen(true);
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link href="/">
                  <Image
                    src="/icon.png"
                    alt="Logo"
                    width={20}
                    height={20}
                    className="size-5!"
                  />
                  <span className="text-base font-semibold">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            items={data.navMain}
            onLinkClick={handleNavClick}
            showQuickCreate={false}
          />
          <NavSecondary
            items={data.navSecondary}
            className="mt-auto"
            onLinkClick={handleNavClick}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              To access this feature, please sign in to your account or create a
              new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/sign-in" onClick={() => setDialogOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/sign-up" onClick={() => setDialogOpen(false)}>
                Create Account
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
