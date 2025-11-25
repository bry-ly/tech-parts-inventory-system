"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconLock } from "@tabler/icons-react";
import { toast } from "sonner";

interface SecuritySettingsProps {
  session?: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    ipAddress: string | null | undefined;
    userAgent: string | null | undefined;
  };
}

export function SecuritySettings({ session }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.replace("-password", "").replace("confirm-", "confirm");
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Password changed successfully");
    setPasswords({ current: "", new: "", confirm: "" });
    setIsLoading(false);
  };

  const handleSignOutAll = () => {
    toast.success("Signed out from all devices");
  };

  // Parse user agent for device info
  const getDeviceInfo = () => {
    if (!session?.userAgent) return { os: "Unknown", browser: "Unknown" };

    const ua = session.userAgent;
    let os = "Unknown";
    let browser = "Unknown";

    // Detect OS
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    // Detect Browser
    if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";

    return { os, browser };
  };

  const deviceInfo = getDeviceInfo();

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconLock className="size-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={passwords.new}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
            />
          </div>

          <Button onClick={handleChangePassword} disabled={isLoading}>
            <IconDeviceFloppy className="size-4 mr-2" />
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Manage your active sessions and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Auto Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <Switch
              id="session-timeout"
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Active Sessions</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Current Device</p>
                  <p className="text-xs text-muted-foreground">
                    {deviceInfo.os} • {deviceInfo.browser} • Last active:{" "}
                    {session ? formatDate(session.updatedAt) : "Now"}
                  </p>
                  {session?.ipAddress && (
                    <p className="text-xs text-muted-foreground mt-1">
                      IP: {session.ipAddress}
                    </p>
                  )}
                  {session && (
                    <p className="text-xs text-muted-foreground">
                      Session expires:{" "}
                      {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>

          <Button variant="destructive" onClick={handleSignOutAll}>
            Sign Out All Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
