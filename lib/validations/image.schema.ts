import { z } from "zod";

export const imageMetaSchema = z.object({
  entityType: z.enum(["DESTINATION", "BLOG"]),
  entityId: z.string(),

  type: z.enum(["banner", "cover", "gallery", "thumbnail"]),

  isPrimary: z.boolean().optional(),
  position: z.number().optional(),
});

// 🔥 File validator (important)
export function validateImageFile(file: File, label: string) {
  if (!file) throw new Error(`${label} image is required`);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} must be jpg/png/webp`);
  }

  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    throw new Error(`${label} must be < 2MB`);
  }
}