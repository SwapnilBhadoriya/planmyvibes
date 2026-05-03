import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/utils/upload";
import { validateImageFile } from "@/lib/validations/image.schema";
import { slugify } from "@/lib/utils/slugify";
import { deleteFile } from "@/lib/utils/deleteFile";

export async function createPlaceWithImagesService({
  data,
  coverFile,
  galleryFiles,
}: {
  data: any;
  coverFile?: File | null;
  galleryFiles?: File[];
}) {
  return await prisma.$transaction(async (tx) => {

    const destination = await tx.destination.findUnique({
      where: { id: data.destinationId },
    });

    if (!destination) {
      throw new Error("Destination not found");
    }

  
    const place = await tx.place.create({
      data,
    });

    const placeId = place.id;

    const folderName = `uploads/places/${slugify(place.name)}-${placeId}`;

    const images: any[] = [];

    if (coverFile) {
      validateImageFile(coverFile, "Cover");

      const coverUrl = await uploadFile(coverFile, {
        folder: folderName,
        fileName: "cover",
      });

      images.push({
        url: coverUrl,
        entityType: "PLACE",
        entityId: placeId,
        type: "cover",
        isPrimary: true,
        position: 1,
      });
    }

    if (galleryFiles?.length) {
      let position = 2;

      for (const file of galleryFiles) {
        validateImageFile(file, "Gallery");

        const url = await uploadFile(file, {
          folder: folderName,
          fileName: `gallery-${position}`,
        });

        images.push({
          url,
          entityType: "PLACE",
          entityId: placeId,
          type: "gallery",
          position: position++,
        });
      }
    }

    
    if (images.length) {
      await tx.image.createMany({ data: images });
    }

    return place;
  });
}

export async function getPlacesService(params: {
  destinationId?: string | null;
  type?: string | null;
}) {
  const { destinationId, type } = params;

  const places = await prisma.place.findMany({
    where: {
      ...(destinationId ? { destinationId } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  if (!places.length) return [];

  const ids = places.map((p) => p.id);

  
  const images = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: { in: ids },
    },
    orderBy: { position: "asc" },
  });


  const imageMap: Record<string, any[]> = {};

  for (const img of images) {
    if (!imageMap[img.entityId]) {
      imageMap[img.entityId] = [];
    }
    imageMap[img.entityId].push(img);
  }

  return places.map((place) => {
    const imgs = imageMap[place.id] || [];

    return {
      ...place,
      cover: imgs.find((i) => i.type === "cover") || null,
      gallery: imgs.filter((i) => i.type === "gallery"),
    };
  });
}

export async function getPlaceByIdService(id: string) {
  const place = await prisma.place.findUnique({
    where: { id },

    include: {
      destination: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  if (!place) {
    throw new Error("Place not found");
  }

  const images = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: id,
    },
    orderBy: { position: "asc" },
  });

  const cover = images.find((img) => img.type === "cover") || null;

  const gallery = images.filter((img) => img.type === "gallery");

  return {
    ...place,
    cover,
    gallery,
  };
}

export async function deletePlaceService(id: string) {
  // Check place exists
  const place = await prisma.place.findUnique({
    where: { id },
  });

  if (!place) {
    throw new Error("Place not found");
  }

  // Get all images
  const images = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: id,
    },
  });

  // Delete files from storage (IMPORTANT FIRST)
  for (const img of images) {
    try {
      await deleteFile(img.url); // local / S3 / Cloudinary
    } catch (err) {
      console.error("Failed to delete file:", img.url);
      // don't stop — continue cleanup
    }
  }

  
  return await prisma.$transaction(async (tx) => {
    // delete images (DB)
    await tx.image.deleteMany({
      where: {
        entityType: "PLACE",
        entityId: id,
      },
    });

    
    await tx.place.delete({
      where: { id },
    });

    return { success: true };
  });
}

export async function updatePlaceService({
  id,
  data,
  coverFile,
  galleryFiles,
  removeCover,
  removeGalleryIds,
}: {
  id: string;
  data: any;
  coverFile?: File | null;
  galleryFiles?: File[];
  removeCover?: boolean;
  removeGalleryIds?: number[];
}) {

  const existing = await prisma.place.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Place not found");
  }

  const existingImages = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: id,
    },
  });

  const folderName = `uploads/places/${slugify(
    data.name || existing.name
  )}-${id}`;

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.place.update({
      where: { id },
      data,
    });


    const existingCover = existingImages.find(
      (img) => img.type === "cover"
    );

    if (removeCover && !coverFile) {
      if (existingCover) {
        await deleteFile(existingCover.url);

        await tx.image.delete({
          where: { id: existingCover.id },
        });
      }
    }
    if (coverFile) {
      validateImageFile(coverFile, "Cover");

      if (existingCover) {
        await deleteFile(existingCover.url);

        await tx.image.delete({
          where: { id: existingCover.id },
        });
      }

      const coverUrl = await uploadFile(coverFile, {
        folder: folderName,
        fileName: "cover",
      });

      await tx.image.create({
        data: {
          url: coverUrl,
          entityType: "PLACE",
          entityId: id,
          type: "cover",
          isPrimary: true,
          position: 1,
        },
      });
    }

    

 
    if (removeGalleryIds?.length) {
      const imagesToDelete = existingImages.filter((img) =>
        removeGalleryIds.includes(img.id)
      );

      for (const img of imagesToDelete) {
        await deleteFile(img.url);
      }

      await tx.image.deleteMany({
        where: {
          id: { in: removeGalleryIds },
        },
      });
    }

    if (galleryFiles?.length) {
      let position = 2;

      const newImages = [];

      for (const file of galleryFiles) {
        validateImageFile(file, "Gallery");

        const url = await uploadFile(file, {
          folder: folderName,
          fileName: `gallery-${Date.now()}`,
        });

        newImages.push({
          url,
          entityType: "PLACE",
          entityId: id,
          type: "gallery",
          position: position++,
        });
      }

      await tx.image.createMany({
        data: newImages,
      });
    }

    return updated;
  });
}