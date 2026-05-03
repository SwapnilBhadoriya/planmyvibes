import { z } from "zod";

export const placeSchema = z.object({
  name: z.string().min(1, "Name is required"),

  destinationId: z.string().min(1, "Destination is required"),

  type: z.string().optional(),
  description: z.string().optional(),

  priceMin: z.number().optional(),
  priceMax: z.number().optional(),

  durationMinutes: z.number().optional(),

  rating: z.number().min(0).max(5).optional(),

  address: z.string().optional(),
  googleMapsLink: z.string().url().optional(),
});
