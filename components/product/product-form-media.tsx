use client

import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Zap, Upload, X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import type { Tag } from "@/lib/types";

interface ProductFormMediaProps {
  tags: Tag[];
}

export function ProductFormMedia({ tags }: ProductFormMediaProps) {
  const form = useFormContext();
  const { imagePreview, handleImageChange, handleRemoveImage, resetImage } =
    useImageUpload();

  // Sync image URL with form field
  useEffect(() => {
    if (imagePreview) {
      form.setValue("imageUrl", imagePreview);
    }
  }, [imagePreview, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(e);
    }
  };

  const handleRemoveImageButton = () => {
    handleRemoveImage();
    form.setValue("imageUrl", "");
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImageButton}
                      className="mt-2"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="imageFile"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <Input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
                <Input type="hidden" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {tags.length > 0 && (
        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                        field.value?.includes(tag.id)
                          ? "bg-primary/10 border-primary"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(tag.id) || false}
                        onChange={(e) => {
                          const currentTags = field.value || [];
                          const newTags = e.target.checked
                            ? [...currentTags, tag.id]
                            : currentTags.filter((id) => id !== tag.id);
                          field.onChange(newTags);
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground mt-2">
                Select tags to categorize this product
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Internal notes</FormLabel>
            <FormControl>
              <Textarea
                rows={5}
                placeholder="Share internal notes or handling tips"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}