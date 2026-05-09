import { z } from "zod";

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  destinationId: z.string().min(1, "Destination is required"),

  type: z.string().optional(),

  placeIds: z.array(z.string()).min(1, "At least one place required"),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});