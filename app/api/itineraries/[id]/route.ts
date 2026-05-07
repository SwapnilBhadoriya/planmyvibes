import { NextResponse } from "next/server";
import { itinerarySyncSchema } from "@/lib/validations/itinerary.schema";
import {
    getItineraryByIdService,
    syncItineraryService,
    deleteItineraryService,
} from "@/services/itinerary.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const data = await getItineraryByIdService(id);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === "Itinerary not found" ? 404 : 500 }
        );
    }
}

export async function PUT(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const body = await req.json();
        const validated = itinerarySyncSchema.parse(body);

        const result = await syncItineraryService(id, validated);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.errors?.[0]?.message || error.message },
            { status: error.message === "Itinerary not found" ? 404 : 400 }
        );
    }
}

export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const result = await deleteItineraryService(id);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === "Itinerary not found" ? 404 : 400 }
        );
    }
}
