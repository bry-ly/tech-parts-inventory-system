"use client";

import { type Icon } from "@tabler/icons-react";
import { IconMail, IconCirclePlusFilled } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateValue, setQuickCreateValue] = useState("");

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create and Mail Buttons in one row */}
        <SidebarMenuItem className="flex items-center gap-2">
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            onClick={() => setQuickCreateOpen(true)}
          >
            <IconCirclePlusFilled />
            <span>Quick Create</span>
          </SidebarMenuButton>
          <Button
            size="icon"
            className="size-8 group-data-[collapsible=icon]:opacity-0"
            variant="outline"
            asChild
          >
            <Link href="/mail">
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Link>
          </Button>
        </SidebarMenuItem>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Quick Create Dialog */}
        <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Create</DialogTitle>
            </DialogHeader>
            <Input
              value={quickCreateValue}
              onChange={(e) => setQuickCreateValue(e.target.value)}
              placeholder="Enter item name..."
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setQuickCreateOpen(false);
                  setQuickCreateValue("");
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
