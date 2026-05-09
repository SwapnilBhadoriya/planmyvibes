import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/utils/upload";
import { slugify } from "@/lib/utils/slugify";
import { validateImageFile } from "@/lib/validations/image.schema";

export async function createDestinationService({
  data,
  bannerFile,
  coverFile,
}: {
  data: any;
  bannerFile: File;
  coverFile: File;
}) {

  return await prisma.$transaction(async (tx) => {
    // Create destination
    const destination = await tx.destination.create({
      data,
    });

    const destinationId = destination.id;

    // Upload files
    const folderName = `uploads/destinations/${slugify(destination.slug)}-${destinationId}`;

    const bannerUrl = await uploadFile(bannerFile, {
      folder: folderName,
      fileName: "banner",
    });

    const coverUrl = await uploadFile(coverFile, {
      folder: folderName,
      fileName: "cover",
    });

    // Save images
    await tx.image.createMany({
      data: [
        {
          url: bannerUrl,
          entityType: "DESTINATION",
          entityId: destinationId,
          type: "banner",
          isPrimary: true,
          position: 1,
        },
        {
          url: coverUrl,
          entityType: "DESTINATION",
          entityId: destinationId,
          type: "cover",
          position: 2,
        },
      ],
    });

    return destination;
  });
}

export async function getDestinationsService(params: {
  type?: "country" | "state" | "city";
  parentId?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}) {
  const { type, parentId, search, page = 1, limit = 20 } = params;

  const where = {
    ...(type ? { type } : {}),
    ...(parentId ? { parentId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [total, destinations] = await Promise.all([
    prisma.destination.count({ where }),
    prisma.destination.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const ids = destinations.map((d) => d.id);

  const images = ids.length
    ? await prisma.image.findMany({
        where: { entityType: "DESTINATION", entityId: { in: ids } },
        orderBy: { position: "asc" },
      })
    : [];

  const imageMap: Record<string, any[]> = {};
  for (const img of images) {
    if (!imageMap[img.entityId]) imageMap[img.entityId] = [];
    imageMap[img.entityId].push(img);
  }

  return {
    data: destinations.map((dest) => ({ ...dest, images: imageMap[dest.id] || [] })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateDestinationService({
  id,
  data,
  bannerFile,
  coverFile,
  removeBanner,
  removeCover,
}: {
  id: string;
  data: any;
  bannerFile?: File | null;
  coverFile?: File | null;
  removeBanner?: boolean;
  removeCover?: boolean;
}) {
  return await prisma.$transaction(async (tx) => {
    // Check exists
    const existing = await tx.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Destination not found");
    }

    // Update destination
    const updated = await tx.destination.update({
      where: { id },
      data,
    });

    const folderName = `uploads/destinations/${slugify(
      updated.slug
    )}-${id}`;

    // HANDLE BANNER
    if (removeBanner && !bannerFile) {
      throw new Error("Cover image is required");
    }

    // replace case
    if (bannerFile) {
      await tx.image.deleteMany({
        where: {
          entityType: "DESTINATION",
          entityId: id,
          type: "banner",
        },
      });

      validateImageFile(bannerFile, "Banner");

      const bannerUrl = await uploadFile(bannerFile, {
        folder: folderName,
        fileName: "banner",
      });

      await tx.image.create({
        data: {
          url: bannerUrl,
          entityType: "DESTINATION",
          entityId: id,
          type: "banner",
          position: 1,
          isPrimary: true,
        },
      });
    }

    // HANDLE COVER
    if (removeCover && !coverFile) {
      throw new Error("Cover image is required");
    }

    // replace case
    if (coverFile) {
      await tx.image.deleteMany({
        where: {
          entityType: "DESTINATION",
          entityId: id,
          type: "cover",
        },
      });

      validateImageFile(coverFile, "Cover");

      const coverUrl = await uploadFile(coverFile, {
        folder: folderName,
        fileName: "cover",
      });

      await tx.image.create({
        data: {
          url: coverUrl,
          entityType: "DESTINATION",
          entityId: id,
          type: "cover",
          position: 2,
        },
      });
    }

    return updated;
  });
}

export async function deleteDestinationService(id: string) {
  return await prisma.$transaction(async (tx) => {
    // Check exists
    const existing = await tx.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Destination not found");
    }

    // Check children
    const children = await tx.destination.findFirst({
      where: { parentId: id },
    });

    if (children) {
      throw new Error(
        "Cannot delete destination with child destinations"
      );
    }

    // Delete related images (polymorphic)
    await tx.image.deleteMany({
      where: {
        entityType: "DESTINATION",
        entityId: id,
      },
    });

    // Delete destination
    await tx.destination.delete({
      where: { id },
    });

    return { success: true };
  });
}

export async function getDestinationByIdService(id: string) {
  const destination = await prisma.destination.findUnique({
    where: { id },

    include: {
      parent: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },

      children: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },

    },
  });

  if (!destination) {
    throw new Error("Destination not found");
  }


  const images = await prisma.image.findMany({
    where: {
      entityType: "DESTINATION",
      entityId: id,
    },
    orderBy: { position: "asc" },
  });

  return {
    ...destination,
    images,
  };
}