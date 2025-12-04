import type React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Settings | Hardware Inventory Management",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SettingsPage(props: PageProps) {
  const searchParams = await props.searchParams;
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

  // Get session information
  const sessionInfo = {
    createdAt: session.session.createdAt,
    updatedAt: session.session.updatedAt,
    expiresAt: session.session.expiresAt,
    ipAddress: session.session.ipAddress,
    userAgent: session.session.userAgent,
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
        <SiteHeader title="Settings" />
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 p-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="mt-1 text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
            </div>

            <SettingsTabs
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ?? null,
              }}
              session={sessionInfo}
              defaultTab={(searchParams.tab as string) || "profile"}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
