import prisma from "@/lib/prisma";

export async function createBlogService(data: {
    title: string;
    slug: string;
    content: string;
    entityType: string;
    entityId?: string;
    type?: string;
}) {
    return await prisma.blog.create({
        data,
    });
}

export async function getBlogsService(params: {
    entityType?: string | null;
    entityId?: string | null;
    type?: string | null;
    page?: number;
    limit?: number;
}) {
    const {
        entityType,
        entityId,
        type,
        page = 1,
        limit = 10,
    } = params;

    const skip = (page - 1) * limit;

    const where = {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
        ...(type ? { type } : {}),
    };

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),

        prisma.blog.count({ where }),
    ]);

    return {
        data: blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getBlogByIdService(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  return blog;
}

export async function deleteBlogService(id: string) {
    return await prisma.$transaction(async (tx) => {
        const existing = await tx.blog.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new Error("Blog not found");
        }


        await tx.blog.delete({
            where: { id },
        });

        return { success: true };
    });
}

export async function updateBlogService({
    id,
    data,
}: {
    id: string;
    data: any;
}) {
    return await prisma.$transaction(async (tx) => {

        const existing = await tx.blog.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new Error("Blog not found");
        }


        const updated = await tx.blog.update({
            where: { id },
            data,
        });

        return updated;
    });
}