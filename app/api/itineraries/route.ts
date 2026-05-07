import { NextResponse } from "next/server";
import { z } from "zod";
import { itinerarySchema } from "@/lib/validations/itinerary.schema";
import { createItineraryService, getItinerariesService } from "@/services/itinerary.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validated = itinerarySchema.parse(body);

        const result = await createItineraryService(validated);

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error?.errors?.[0]?.message || error.message,
            },
            { status: 400 }
        );
    }
}

const querySchema = z.object({
    tripType: z.enum(["solo", "couple", "family", "group"]).optional(),
    difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
    travelMode: z.enum(["car", "bike", "train", "flight", "bus", "mixed"]).optional(),
    destinationId: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const parsed = querySchema.parse({
            tripType: searchParams.get("tripType") ?? undefined,
            difficulty: searchParams.get("difficulty") ?? undefined,
            travelMode: searchParams.get("travelMode") ?? undefined,
            destinationId: searchParams.get("destinationId") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        });

        const result = await getItinerariesService(parsed);

        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.errors?.[0]?.message || error.message },
            { status: 400 }
        );
    }
}
