import { z } from "zod";

export const transportSchema = z.object({
    mode: z
        .enum(["walk", "scooter", "bike", "car", "cab", "bus", "metro", "train", "flight"])
        .optional(),
    provider: z.string().max(100).optional(),
    fromPlaceId: z.string().min(1).optional(),
    toPlaceId: z.string().min(1).optional(),
    durationMinutes: z.number().int().positive().optional(),
    distanceKm: z.number().positive().optional(),
    cost: z.number().int().nonnegative().optional(),
    notes: z.string().optional(),
});

export const tipSchema = z.object({
    type: z.string().max(50).optional(),
    content: z.string().min(1, "Tip content is required"),
});

export const activityImageSchema = z.object({
    url: z.url("Invalid image URL"),
    altText: z.string().max(255).optional(),
    type: z.enum(["banner", "cover", "gallery", "thumbnail"]).default("gallery"),
    isPrimary: z.boolean().default(false),
    position: z.number().int().positive().optional(),
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const activitySchema = z.object({
    title: z.string().max(255).optional(),
    activityType: z
        .enum(["sightseeing", "food", "travel", "adventure", "relaxation", "shopping", "other"])
        .optional(),
    startTime: z.string().regex(timeRegex, "startTime must be in HH:MM format (24h)").optional(),
    endTime: z.string().regex(timeRegex, "endTime must be in HH:MM format (24h)").optional(),
    position: z.number().int().positive().optional(),
    notes: z.string().optional(),
    isOptional: z.boolean().default(false),
    placeIds: z.array(z.string().min(1)).optional(),
    transports: z.array(transportSchema).optional(),
    tips: z.array(tipSchema).optional(),
    images: z.array(activityImageSchema).optional(),
});

export const daySchema = z.object({
    dayNumber: z.number().int().positive("Day number must be a positive integer"),
    title: z.string().max(255).optional(),
    destinationId: z.string().min(1).optional(),
    activities: z.array(activitySchema).optional(),
});

// Granular day update — only fields that belong to the day row itself
export const dayUpdateSchema = z.object({
    title: z.string().max(255).optional(),
    destinationId: z.string().min(1).optional(),
});

// Granular activity update — top-level fields + add/remove sub-resources
export const activityUpdateSchema = z.object({
    title: z.string().max(255).optional(),
    activityType: z
        .enum(["sightseeing", "food", "travel", "adventure", "relaxation", "shopping", "other"])
        .optional(),
    startTime: z.string().regex(timeRegex, "startTime must be in HH:MM format (24h)").optional(),
    endTime: z.string().regex(timeRegex, "endTime must be in HH:MM format (24h)").optional(),
    position: z.number().int().positive().optional(),
    notes: z.string().optional(),
    isOptional: z.boolean().optional(),
    // Places
    addPlaceIds: z.array(z.string().min(1)).optional(),
    removePlaceIds: z.array(z.string().min(1)).optional(),
    // Transports
    addTransports: z.array(transportSchema).optional(),
    removeTransportIds: z.array(z.number().int().positive()).optional(),
    // Tips
    addTips: z.array(tipSchema).optional(),
    removeTipIds: z.array(z.number().int().positive()).optional(),
    // Images
    addImages: z.array(activityImageSchema).optional(),
    removeImageIds: z.array(z.number().int().positive()).optional(),
});

const destinationEntrySchema = z.object({
    destinationId: z.string().min(1, "Destination ID is required"),
    position: z.number().int().positive().optional(),
});

// Shared cross-field refinement helpers
function budgetRefine(data: { budgetMin?: number; budgetMax?: number }) {
    if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        return data.budgetMin <= data.budgetMax;
    }
    return true;
}

function peopleRefine(data: { minPeople?: number; maxPeople?: number }) {
    if (data.minPeople !== undefined && data.maxPeople !== undefined) {
        return data.minPeople <= data.maxPeople;
    }
    return true;
}

// Base object — kept separate so .omit() / .extend() work before refinements are applied
const itineraryBaseSchema = z.object({
    title: z.string().max(255).optional(),
    subtitle: z.string().max(255).optional(),
    description: z.string().optional(),
    durationDays: z.number().int().positive().optional(),
    budgetMin: z.number().int().nonnegative().optional(),
    budgetMax: z.number().int().nonnegative().optional(),
    currency: z.string().max(10).optional(),
    tripType: z.enum(["solo", "couple", "family", "group"]).optional(),
    difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
    travelMode: z.enum(["car", "bike", "train", "flight", "bus", "mixed"]).optional(),
    stayNights: z.number().int().nonnegative().optional(),
    minPeople: z.number().int().positive().optional(),
    maxPeople: z.number().int().positive().optional(),
    totalPlaces: z.number().int().nonnegative().optional(),
    estimatedBudget: z.number().int().nonnegative().optional(),
    destinationIds: z.array(destinationEntrySchema).optional(),
    days: z.array(daySchema).optional(),
});

export const itinerarySchema = itineraryBaseSchema
    .refine(budgetRefine, {
        message: "budgetMin must be less than or equal to budgetMax",
        path: ["budgetMax"],
    })
    .refine(peopleRefine, {
        message: "minPeople must be less than or equal to maxPeople",
        path: ["maxPeople"],
    })
    .refine(
        (data) => {
            if (data.days) {
                const dayNumbers = data.days.map((d) => d.dayNumber);
                return new Set(dayNumbers).size === dayNumbers.length;
            }
            return true;
        },
        { message: "Day numbers must be unique within an itinerary", path: ["days"] }
    );

// Days/activities are managed via their own dedicated routes, not the main PUT
export const itineraryUpdateSchema = itineraryBaseSchema
    .omit({ destinationIds: true, days: true })
    .extend({
        addDestinationIds: z.array(destinationEntrySchema).optional(),
        removeDestinationIds: z.array(z.string().min(1)).optional(),
    })
    .refine(budgetRefine, {
        message: "budgetMin must be less than or equal to budgetMax",
        path: ["budgetMax"],
    })
    .refine(peopleRefine, {
        message: "minPeople must be less than or equal to maxPeople",
        path: ["maxPeople"],
    });

// ─── Sync schemas ─────────────────────────────────────────────────────────────
// Same as create schemas but each item carries an optional id.
// id present  = item exists in DB → update
// id absent   = new item → create
// item in DB but absent from payload → delete

const syncTransportSchema = transportSchema.extend({
    id: z.number().int().positive().optional(),
});

const syncTipSchema = tipSchema.extend({
    id: z.number().int().positive().optional(),
});

const syncImageSchema = activityImageSchema.extend({
    id: z.number().int().positive().optional(),
});

const syncActivitySchema = z.object({
    id: z.string().optional(),
    title: z.string().max(255).optional(),
    activityType: z
        .enum(["sightseeing", "food", "travel", "adventure", "relaxation", "shopping", "other"])
        .optional(),
    startTime: z.string().regex(timeRegex, "startTime must be in HH:MM format (24h)").optional(),
    endTime: z.string().regex(timeRegex, "endTime must be in HH:MM format (24h)").optional(),
    position: z.number().int().positive().optional(),
    notes: z.string().optional(),
    isOptional: z.boolean().default(false),
    placeIds: z.array(z.string().min(1)).optional(),
    transports: z.array(syncTransportSchema).optional(),
    tips: z.array(syncTipSchema).optional(),
    images: z.array(syncImageSchema).optional(),
});

const syncDaySchema = z.object({
    id: z.number().int().positive().optional(),
    dayNumber: z.number().int().positive("Day number must be a positive integer"),
    title: z.string().max(255).optional(),
    destinationId: z.string().min(1).optional(),
    activities: z.array(syncActivitySchema).optional(),
});

export const itinerarySyncSchema = itineraryBaseSchema
    .omit({ destinationIds: true, days: true })
    .extend({
        destinationIds: z.array(destinationEntrySchema).optional(),
        days: z.array(syncDaySchema).optional(),
    })
    .refine(budgetRefine, {
        message: "budgetMin must be less than or equal to budgetMax",
        path: ["budgetMax"],
    })
    .refine(peopleRefine, {
        message: "minPeople must be less than or equal to maxPeople",
        path: ["maxPeople"],
    })
    .refine(
        (data) => {
            if (data.days) {
                const dayNumbers = data.days.map((d) => d.dayNumber);
                return new Set(dayNumbers).size === dayNumbers.length;
            }
            return true;
        },
        { message: "Day numbers must be unique within an itinerary", path: ["days"] }
    );

export type ItineraryInput = z.infer<typeof itinerarySchema>;
export type ItineraryUpdateInput = z.infer<typeof itineraryUpdateSchema>;
export type ItinerarySyncInput = z.infer<typeof itinerarySyncSchema>;
export type DayInput = z.infer<typeof daySchema>;
export type DayUpdateInput = z.infer<typeof dayUpdateSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type ActivityUpdateInput = z.infer<typeof activityUpdateSchema>;
