/**
 * Custom hook for handling image uploads
 * Provides Base64 conversion, preview management, and file validation
 */

import { type ChangeEvent, useState, useCallback } from "react";
import { toast } from "sonner";

interface UseImageUploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxSizeInMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  } = options;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        );
        return;
      }

      // Validate file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error(`File size must be less than ${maxSizeInMB}MB`);
        return;
      }

      setIsUploading(true);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageUrl(base64String);
        setIsUploading(false);
        toast.success("Image loaded successfully");
      };

      reader.onerror = () => {
        toast.error("Failed to read image file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    },
    [maxSizeInMB, allowedTypes]
  );

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setImageUrl("");
  }, []);

  const resetImage = useCallback(() => {
    setImagePreview(null);
    setImageUrl("");
    setIsUploading(false);
  }, []);

  const setInitialImage = useCallback((url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  }, []);

  return {
    imagePreview,
    imageUrl,
    isUploading,
    handleImageChange,
    handleRemoveImage,
    resetImage,
    setInitialImage,
  };
}
