import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
    entityType: z.string().min(1),
    entityId: z.string().min(1),
    tagNames: z.array(z.string().min(1).max(50)),
});

// POST /api/tags/sync — upsert tags by name and sync mappings for an entity
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { entityType, entityId, tagNames } = schema.parse(body);

        const tags = await Promise.all(
            tagNames.map((name) =>
                prisma.tag.upsert({
                    where: { name: name.toLowerCase().trim() },
                    create: { name: name.toLowerCase().trim() },
                    update: {},
                })
            )
        );

        const tagIds = tags.map((t) => t.id);

        // Delete mappings for tags no longer in the list
        await prisma.tagMapping.deleteMany({
            where: { entityType, entityId, tagId: { notIn: tagIds } },
        });

        // Add new mappings (skip duplicates)
        if (tagIds.length) {
            await prisma.tagMapping.createMany({
                data: tagIds.map((tagId) => ({ tagId, entityType, entityId })),
                skipDuplicates: true,
            });
        }

        return NextResponse.json({ success: true, data: tags });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.errors?.[0]?.message || error.message },
            { status: 400 }
        );
    }
}

// GET /api/tags/sync?entityType=PLACE&entityId=xxx — fetch tags for an entity
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const entityType = searchParams.get("entityType");
        const entityId = searchParams.get("entityId");

        if (!entityType || !entityId) {
            return NextResponse.json({ success: true, data: [] });
        }

        const mappings = await prisma.tagMapping.findMany({
            where: { entityType, entityId },
            include: { tag: true },
        });

        return NextResponse.json({ success: true, data: mappings.map((m) => m.tag) });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
