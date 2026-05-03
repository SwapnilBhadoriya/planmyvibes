import { NextResponse } from "next/server";
import { deletePlaceService, getPlaceByIdService, updatePlaceService } from "@/services/place.service";
import { placeSchema } from "@/lib/validations/place.schema";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        if (!id) {
            throw new Error("ID is required");
        }

        const data = await getPlaceByIdService(id);

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 404 }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        if (!id) {
            throw new Error("ID is required");
        }

        const result = await deletePlaceService(id);

        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 400 }
        );
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const formData = await req.formData();

        const getString = (key: string) => {
            const val = formData.get(key);
            return val ? String(val) : undefined;
        };

        const getNumber = (key: string) => {
            const val = formData.get(key);
            return val ? Number(val) : undefined;
        };

        // build raw data
        const rawData = {
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

        // 🔥 remove undefined fields (VERY IMPORTANT for update)
        const data = Object.fromEntries(
            Object.entries(rawData).filter(([_, v]) => v !== undefined)
        );

        const validated = placeSchema.partial().parse(data);

        const coverFile = formData.get("cover") as File | null;
        const galleryFiles = formData.getAll("gallery") as File[];

        const removeCover = formData.get("removeCover") === "true";

        const removeGalleryIds = formData.get("removeGalleryIds")
            ? String(formData.get("removeGalleryIds"))
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => !isNaN(id))
            : [];

        const result = await updatePlaceService({
            id,
            data: validated,
            coverFile,
            galleryFiles,
            removeCover,
            removeGalleryIds,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 400 }
        );
    }
}