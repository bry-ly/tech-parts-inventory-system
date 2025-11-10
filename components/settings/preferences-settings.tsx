"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconDeviceFloppy, IconMoon, IconSun } from "@tabler/icons-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export function PreferencesSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [compactMode, setCompactMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Preferences updated successfully");
    setIsLoading(false);
  };

  const handleReset = () => {
    setTheme("system");
    setLanguage("en");
    setTimezone("UTC");
    setDateFormat("MM/DD/YYYY");
    setCompactMode(false);
    setSoundEffects(true);
    toast.info("Preferences reset to default");
  };

  const handleDownloadData = () => {
    toast.success("Data download started");
  };

  const handleExportInventory = () => {
    toast.success("Inventory export started");
  };

  const handleDeleteAccount = () => {
    toast.error("This action requires confirmation");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("light")}
              >
                <IconSun className="size-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("dark")}
              >
                <IconMoon className="size-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing for a more dense layout
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications and actions
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={soundEffects}
              onCheckedChange={setSoundEffects}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>
            Configure language, timezone, and date formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="tl">Tagalog</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">
                  UTC (Coordinated Universal Time)
                </SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="PHT">PHT (Philippine Time)</SelectItem>
                <SelectItem value="JST">JST (Japan Standard Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleDownloadData}
            >
              Download My Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportInventory}
            >
              Export Inventory
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Deleting your account will permanently remove all your data. This
            action cannot be undone.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          <IconDeviceFloppy className="size-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
