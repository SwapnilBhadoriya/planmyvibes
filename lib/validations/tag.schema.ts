import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50)
    .transform((val) => val.trim()),

  type: z
    .string()
    .max(50)
    .optional()
    .transform((val) => (val ? val.trim().toLowerCase() : undefined)),
});