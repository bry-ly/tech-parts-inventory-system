"use client";

import { useUploadFiles } from "better-upload/client";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

export function Uploader() {
  const { control } = useUploadFiles({
    route: "demo",
  });

  return <UploadDropzone control={control} accept="image/*" />;
}
