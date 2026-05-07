import prisma from "@/lib/prisma";

export async function createTagService(data: {
  name: string;
  type?: string;
}) {
  try {
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        type: data.type,
      },
    });

    return tag;

  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Tag already exists");
    }

    throw error;
  }
}

export async function getTagsService(params: {
  type?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}) {
  const {
    type,
    search,
    page = 1,
    limit = 20,
  } = params;

  const skip = (page - 1) * limit;

  const where = {
    ...(type ? { type } : {}),
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.tag.count({ where }),
  ]);

  return {
    data: tags,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function deleteTagService(id: number) {
  return await prisma.$transaction(async (tx) => {
    
    const existing = await tx.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Tag not found");
    }

   
    await tx.tagMapping.deleteMany({
      where: { tagId: id },
    });

   
    await tx.tag.delete({
      where: { id },
    });

    return { success: true };
  });
}

export async function updateTagService(
  id: number,
  data: {
    name?: string;
    type?: string;
  }
) {
  try {
   
    const existing = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Tag not found");
    }

  
    const updated = await prisma.tag.update({
      where: { id },
      data,
    });

    return updated;

  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Tag name already exists");
    }
    throw error;
  }
}