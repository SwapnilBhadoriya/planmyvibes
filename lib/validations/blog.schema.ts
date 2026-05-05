import { z } from "zod";

export const blogSchema = z.object({
    title: z.string().min(1, "Title is required"),

    slug: z.string().min(1, "Slug is required"),

    content: z.string().min(1, "Content is required"),

    entityType: z
        .string()
        .min(1, "entityType is required")
        .max(50)
        .transform((val) => val.toUpperCase()),

    entityId: z.string().optional(),

    type: z.string().optional(),
}).refine(
    (data) => {
        // if entityType is provided → entityId must exist
        if (data.entityType && !data.entityId) return false;
        return true;
    },
    {
        message: "entityId is required when entityType is provided",
        path: ["entityId"],
    }
);

