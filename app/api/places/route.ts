import { NextResponse } from "next/server";
import { placeSchema } from "@/lib/validations/place.schema";
import { createPlaceWithImagesService, getPlacesService } from "@/services/place.service";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const getString = (key: string) => {
            const val = formData.get(key);
            return val ? String(val) : undefined;
        };

        const getNumber = (key: string) => {
            const val = formData.get(key);
            return val ? Number(val) : undefined;
        };

        const data = {
            name: getString("name"),
            destinationId: getString("destinationId"),

            type: getString("type"),
            description: getString("description"),

            priceMin: getNumber("priceMin"),
            priceMax: getNumber("priceMax"),

            durationMinutes: getNumber("durationMinutes"),

            rating: getNumber("rating"),

            address: getString("address"),
            googleMapsLink: getString("googleMapsLink"),
        };

        const validated = placeSchema.parse(data);

        const coverFile = formData.get("cover") as File | null;

        const galleryFiles = formData.getAll("gallery") as File[];

        const result = await createPlaceWithImagesService({
            data: validated,
            coverFile,
            galleryFiles,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });

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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const destinationId = searchParams.get("destinationId");
        const type = searchParams.get("type");
        const search = searchParams.get("search");
        const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

        const result = await getPlacesService({ destinationId, type, search, page, limit });

        return NextResponse.json({ success: true, ...result });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}