import prisma from "@/lib/prisma";

async function attachCover<T extends { id: string }>(items: T[]): Promise<(T & { coverImage: string | null })[]> {
    if (!items.length) return items.map((i) => ({ ...i, coverImage: null }));
    const covers = await prisma.image.findMany({
        where: { entityType: "BLOG", entityId: { in: items.map((i) => i.id) }, type: "cover" },
        select: { entityId: true, url: true },
    });
    const map: Record<string, string> = {};
    for (const c of covers) map[c.entityId] = c.url;
    return items.map((i) => ({ ...i, coverImage: map[i.id] ?? null }));
}

async function upsertCover(tx: Awaited<Parameters<Parameters<typeof prisma.$transaction>[0]>[0]>, entityId: string, url: string | null | undefined) {
    if (url === undefined) return; // not provided — leave as-is
    await tx.image.deleteMany({ where: { entityType: "BLOG", entityId, type: "cover" } });
    if (url) {
        await tx.image.create({ data: { entityType: "BLOG", entityId, type: "cover", url } });
    }
}

export async function createBlogService(data: {
    title: string;
    slug: string;
    content: string;
    entityType: string;
    entityId?: string;
    type?: string;
    coverImage?: string | null;
    status?: "DRAFT" | "PUBLISHED";
}) {
    const { coverImage, ...rest } = data;
    return await prisma.$transaction(async (tx) => {
        const blog = await tx.blog.create({ data: rest });
        await upsertCover(tx, blog.id, coverImage);
        const cover = coverImage ? await tx.image.findFirst({ where: { entityType: "BLOG", entityId: blog.id, type: "cover" } }) : null;
        return { ...blog, coverImage: cover?.url ?? null };
    });
}

export async function getBlogsService(params: {
    entityType?: string | null;
    entityId?: string | null;
    type?: string | null;
    page?: number;
    limit?: number;
}) {
    const { entityType, entityId, type, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const where = {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
        ...(type ? { type } : {}),
    };
    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
        prisma.blog.count({ where }),
    ]);
    const data = await attachCover(blogs);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getBlogByIdService(id: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog not found");
    const cover = await prisma.image.findFirst({ where: { entityType: "BLOG", entityId: id, type: "cover" } });
    return { ...blog, coverImage: cover?.url ?? null };
}

export async function deleteBlogService(id: string) {
    return await prisma.$transaction(async (tx) => {
        const existing = await tx.blog.findUnique({ where: { id } });
        if (!existing) throw new Error("Blog not found");
        await tx.image.deleteMany({ where: { entityType: "BLOG", entityId: id } });
        await tx.blog.delete({ where: { id } });
        return { success: true };
    });
}

export async function updateBlogService({ id, data }: { id: string; data: any }) {
    const { coverImage, ...rest } = data;
    return await prisma.$transaction(async (tx) => {
        const existing = await tx.blog.findUnique({ where: { id } });
        if (!existing) throw new Error("Blog not found");
        const updated = await tx.blog.update({ where: { id }, data: rest });
        await upsertCover(tx, id, coverImage);
        const cover = await tx.image.findFirst({ where: { entityType: "BLOG", entityId: id, type: "cover" } });
        return { ...updated, coverImage: cover?.url ?? null };
    });
}
