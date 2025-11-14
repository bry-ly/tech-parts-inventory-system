"use client";

import type * as React from "react";
import {
  IconDashboard,
  IconShoppingCart,
  IconTags,
  IconPlus,
  IconSettings,
  IconHelp,
} from "@tabler/icons-react";

import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Cpu } from "lucide-react";
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
      title: "Inventory",
      url: "/inventory",
      icon: IconShoppingCart,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: IconTags,
    },
    {
      title: "Add Product",
      url: "/add-product",
      icon: IconPlus,
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

interface DemoSidebarProps {
  user: { name: string; email: string; avatar: string };
}

export function DemoSidebar({
  user,
  ...props
}: DemoSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
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
                <Link href="/demo">
                  <Cpu className="size-5!" />
                  <span className="text-base font-semibold">Tech Parts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                    >
                      <a href={item.url} onClick={(e) => handleNavClick(e, item.url)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="sm"
                    >
                      <a href={item.url} onClick={(e) => handleNavClick(e, item.url)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
              To access this feature, please sign in to your account or create a new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/sign-in" onClick={() => setDialogOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto"
            >
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

