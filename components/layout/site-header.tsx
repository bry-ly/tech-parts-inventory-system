"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SiteHeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: React.ReactNode;
}

export function SiteHeader({ title, breadcrumbs, children }: SiteHeaderProps) {
  const pathname = usePathname();
  let autoBreadcrumbs: Array<{ label: string; href?: string }> = [];
  if (!breadcrumbs) {
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    let href = "";
    autoBreadcrumbs = segments.map((seg, idx) => {
      href += "/" + seg;
      return {
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        href: idx < segments.length - 1 ? href : undefined,
      };
    });
  }

  const crumbsToRender =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : autoBreadcrumbs;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {crumbsToRender.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {crumbsToRender.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < crumbsToRender.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <h1 className="text-base font-medium">{title || "Dashboard"}</h1>
      )}
      <div className="ml-auto flex items-center gap-2">
        {children}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
