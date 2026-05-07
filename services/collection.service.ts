import prisma from "@/lib/prisma";

export async function createCollectionService(data: {
  title: string;
  description?: string;
  destinationId: string;
  type?: string;
  placeIds: string[];
}) {
  return await prisma.$transaction(async (tx) => {
    // Check destination exists
    const destination = await tx.destination.findUnique({
      where: { id: data.destinationId },
    });

    if (!destination) {
      throw new Error("Destination not found");
    }

    // Validate places belong to this destination
    const places = await tx.place.findMany({
      where: {
        id: { in: data.placeIds },
        destinationId: data.destinationId,
      },
      select: { id: true },
    });

    if (places.length !== data.placeIds.length) {
      throw new Error(
        "Some places are invalid or do not belong to the selected destination"
      );
    }

    // Create collection
    const collection = await tx.collection.create({
      data: {
        title: data.title,
        description: data.description,
        destinationId: data.destinationId,
        type: data.type,
      },
    });

    // Create collection items (ordered)
    const items = data.placeIds.map((placeId, index) => ({
      collectionId: collection.id,
      placeId,
      position: index + 1,
    }));

    await tx.collectionItem.createMany({
      data: items,
    });

    return collection;
  });
}

export async function getCollectionsService(params: {
  destinationId?: string | null;
  type?: string | null;
}) {
  const { destinationId, type } = params;


  const collections = await prisma.collection.findMany({
    where: {
      ...(destinationId ? { destinationId } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },

    include: {
      destination: {
        select: {
          id: true,
          name: true,
        },
      },

      collectionItems: {
        orderBy: { position: "asc" },
        include: {
          place: true,
        },
      },
    },
  });

  if (!collections.length) return [];


  const placeIds = collections.flatMap((col) =>
    col.collectionItems.map((item) => item.place.id)
  );


  const images = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: { in: placeIds },
      type: "cover",
    },
  });

  const imageMap: Record<string, any> = {};

  for (const img of images) {
    imageMap[img.entityId] = img;
  }


  return collections.map((col) => ({
    id: col.id,
    title: col.title,
    description: col.description,
    type: col.type,
    destination: col.destination,
    createdAt: col.createdAt,

    places: col.collectionItems.map((item) => ({
      ...item.place,
      cover: imageMap[item.place.id] || null,
      position: item.position,
    })),
  }));
}

export async function getCollectionByIdService(id: string) {
  // 1️⃣ Get collection with places
  const collection = await prisma.collection.findUnique({
    where: { id },

    include: {
      destination: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },

      collectionItems: {
        orderBy: { position: "asc" },
        include: {
          place: true,
        },
      },
    },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // 2️⃣ Collect place IDs
  const placeIds = collection.collectionItems.map(
    (item) => item.place.id
  );

  // 3️⃣ Fetch ALL images (cover + gallery)
  const images = await prisma.image.findMany({
    where: {
      entityType: "PLACE",
      entityId: { in: placeIds },
    },
    orderBy: { position: "asc" },
  });

  // 4️⃣ Group images by placeId
  const imageMap: Record<string, any[]> = {};

  for (const img of images) {
    if (!imageMap[img.entityId]) {
      imageMap[img.entityId] = [];
    }
    imageMap[img.entityId].push(img);
  }

  // 5️⃣ Final response
  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    type: collection.type,
    destination: collection.destination,

    places: collection.collectionItems.map((item) => {
      const imgs = imageMap[item.place.id] || [];

      return {
        ...item.place,
        position: item.position,
        cover: imgs.find((i) => i.type === "cover") || null,
        gallery: imgs.filter((i) => i.type === "gallery"),
      };
    }),
  };
}

export async function updateCollectionService({
  id,
  data,
  addPlaceIds = [],
  removePlaceIds = [],
  orderedPlaceIds = [],
}: {
  id: string;
  data: any;
  addPlaceIds?: string[];
  removePlaceIds?: string[];
  orderedPlaceIds?: string[];
}) {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Check collection exists
    const collection = await tx.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    // 2️⃣ Update collection fields
    const updated = await tx.collection.update({
      where: { id },
      data,
    });

    // 3️⃣ Remove places
    if (removePlaceIds.length) {
      await tx.collectionItem.deleteMany({
        where: {
          collectionId: id,
          placeId: { in: removePlaceIds },
        },
      });
    }

    // 4️⃣ Add new places
    if (addPlaceIds.length) {
      const items = addPlaceIds.map((placeId, index) => ({
        collectionId: id,
        placeId,
        position: index + 1,
      }));

      await tx.collectionItem.createMany({
        data: items,
        skipDuplicates: true,
      });
    }

   
    if (orderedPlaceIds.length) {
      for (let i = 0; i < orderedPlaceIds.length; i++) {
        await tx.collectionItem.updateMany({
          where: {
            collectionId: id,
            placeId: orderedPlaceIds[i],
          },
          data: {
            position: i + 1,
          },
        });
      }
    }

    return updated;
  });
}

export async function deleteCollectionService(id: string) {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Check exists
    const existing = await tx.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Collection not found");
    }

    // 2️⃣ Delete collection
    await tx.collection.delete({
      where: { id },
    });

    // 🔥 collectionItems auto-deleted (cascade)

    return { success: true };
  });
}