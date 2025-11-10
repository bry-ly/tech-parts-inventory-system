"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./profile-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { PreferencesSettings } from "./preferences-settings";

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
}

export function SettingsTabs({ user, session }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileSettings user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecuritySettings session={session} />
      </TabsContent>

      <TabsContent value="preferences" className="mt-6">
        <PreferencesSettings />
      </TabsContent>
    </Tabs>
  );
}
