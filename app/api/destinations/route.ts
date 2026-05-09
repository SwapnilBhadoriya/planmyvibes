import { NextResponse } from "next/server";
import { destinationSchema } from "@/lib/validations/destination.schema";
import {
    imageMetaSchema,
    validateImageFile,
} from "@/lib/validations/image.schema";
import { z } from "zod";

import { createDestinationService, getDestinationsService, updateDestinationService } from "@/services/destination.service";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // 🔹 Extract data
        const data = {
            name: String(formData.get("name")),
            slug: String(formData.get("slug")),
            type: String(formData.get("type")),

            parentId: formData.get("parentId") || undefined,

            country: formData.get("country") || undefined,
            state: formData.get("state") || undefined,

            description: formData.get("description") || undefined,
            shortDescription: formData.get("shortDescription") || undefined,

            bestTimeStartMonth: formData.get("bestTimeStartMonth")
                ? Number(formData.get("bestTimeStartMonth"))
                : undefined,

            bestTimeEndMonth: formData.get("bestTimeEndMonth")
                ? Number(formData.get("bestTimeEndMonth"))
                : undefined,

            bestTimeNote: formData.get("bestTimeNote") || undefined,

            avgBudgetPerDay: formData.get("avgBudgetPerDay")
                ? Number(formData.get("avgBudgetPerDay"))
                : undefined,

            isActive: formData.get("isActive")
                ? formData.get("isActive") === "true"
                : true,
        };

        // ✅ Validate destination
        const validated = destinationSchema.parse(data);
        console.log(formData)

        // 🔴 Files
        const bannerFile = formData.get("banner") as File;
        const coverFile = formData.get("cover") as File;

        validateImageFile(bannerFile, "Banner");
        validateImageFile(coverFile, "Cover");

        const result = await createDestinationService({
            data: validated,
            bannerFile,
            coverFile,
        });

        return Response.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error?.errors?.[0]?.message || error.message,
            },
            { status: 400 }
        );
    }
}

const querySchema = z.object({
    type: z.enum(["country", "state", "city"]).optional(),
    parentId: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const parsed = querySchema.parse({
            type: searchParams.get("type") ?? undefined,
            parentId: searchParams.get("parentId") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        });

        const result = await getDestinationsService(parsed);

        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

