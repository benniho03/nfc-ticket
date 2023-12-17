import { generateComponents } from "@uploadthing/react";
 
import type { ImageRouter } from "@/server/uploadthing";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<ImageRouter>();