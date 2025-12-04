"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ProfileSettings } from "./profile-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { PreferencesSettings } from "./preferences-settings";

import {
  IconUser,
  IconBell,
  IconShield,
  IconSettings,
  IconHelp,
} from "@tabler/icons-react";
import { ComingSoon } from "@/components/coming-soon";

interface SettingsTabsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  session?: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    ipAddress: string | null | undefined;
    userAgent: string | null | undefined;
  };
  defaultTab?: string;
}

export function SettingsTabs({
  user,
  session,
  defaultTab = "profile",
}: SettingsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Helper to determine active tab
  const currentTab = searchParams.get("tab") || defaultTab;

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-1/5">
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <button
            onClick={() => handleTabChange("profile")}
            className={`flex items-center gap-2 justify-start rounded-md p-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              currentTab === "profile"
                ? "bg-muted hover:bg-muted"
                : "transparent"
            }`}
          >
            <IconUser className="size-4" />
            Profile
          </button>
          <button
            onClick={() => handleTabChange("notifications")}
            className={`flex items-center gap-2 justify-start rounded-md p-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              currentTab === "notifications"
                ? "bg-muted hover:bg-muted"
                : "transparent"
            }`}
          >
            <IconBell className="size-4" />
            Notifications
          </button>
          <button
            onClick={() => handleTabChange("security")}
            className={`flex items-center gap-2 justify-start rounded-md p-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              currentTab === "security"
                ? "bg-muted hover:bg-muted"
                : "transparent"
            }`}
          >
            <IconShield className="size-4" />
            Security
          </button>
          <button
            onClick={() => handleTabChange("preferences")}
            className={`flex items-center gap-2 justify-start rounded-md p-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              currentTab === "preferences"
                ? "bg-muted hover:bg-muted"
                : "transparent"
            }`}
          >
            <IconSettings className="size-4" />
            Preferences
          </button>
          <button
            onClick={() => handleTabChange("help")}
            className={`flex items-center gap-2 justify-start rounded-md p-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
              currentTab === "help" ? "bg-muted hover:bg-muted" : "transparent"
            }`}
          >
            <IconHelp className="size-4" />
            Help Center
          </button>
        </nav>
      </aside>
      <div className="flex-1 lg:max-w-2xl">
        {currentTab === "profile" && <ProfileSettings user={user} />}
        {currentTab === "notifications" && <NotificationSettings />}
        {currentTab === "security" && <SecuritySettings session={session} />}
        {currentTab === "preferences" && <PreferencesSettings />}
        {currentTab === "help" && <ComingSoon />}
      </div>
    </div>
  );
}
