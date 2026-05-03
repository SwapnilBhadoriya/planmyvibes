import { z } from "zod";

export const destinationSchema = z.object({

  name: z.string().min(1),
  slug: z.string().min(1),

  type: z.enum(["country", "state", "city"]),

  parentId: z.string().optional(),

  country: z.string().optional(),
  state: z.string().optional(),

  description: z.string().optional(),
  shortDescription: z.string().max(255).optional(),

  bestTimeStartMonth: z.number().min(1).max(12).optional(),
  bestTimeEndMonth: z.number().min(1).max(12).optional(),
  bestTimeNote: z.string().optional(),

  avgBudgetPerDay: z.number().optional(),

  isActive: z.boolean().optional(),
});

