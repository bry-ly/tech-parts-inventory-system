"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCamera, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/action/user";

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    bio: "",
    company: "",
    location: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    toast.success("Image removed");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    startTransition(async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email.trim());
      // If imagePreview is null and it was different from original, send empty string to remove it
      // Otherwise, send the imagePreview value (which could be base64 or URL)
      if (imagePreview !== user.image) {
        formDataToSend.append("image", imagePreview || "");
      }

      try {
        const result = await updateUserProfile(formDataToSend);
        if (result?.success) {
          toast.success(result.message ?? "Profile updated successfully");
          router.refresh();
        } else if (result?.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          toast.error(result.message ?? "Validation failed", {
            description: errorMessages,
          });
        } else {
          toast.error(result?.message ?? "Failed to update profile.");
        }
      } catch (error) {
        toast.error("Failed to update profile.", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email,
      bio: "",
      company: "",
      location: "",
    });
    setImagePreview(user.image);
    toast.info("Changes discarded");
  };

  const getInitials = () => {
    if (formData.name) {
      return formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return formData.email[0].toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage
                src={imagePreview || undefined}
                alt={formData.name || "User"}
              />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {imagePreview && imagePreview !== user.image && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
              >
                <IconX className="size-3" />
              </button>
            )}
          </div>
          <div>
            <p className="font-medium">{formData.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
            <label htmlFor="avatar-upload">
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                type="button"
                asChild
              >
                <span className="cursor-pointer">
                  <IconCamera className="size-4 mr-2" />
                  Change Photo
                </span>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your location"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            <IconDeviceFloppy className="size-4 mr-2" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
