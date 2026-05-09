import prisma from "@/lib/prisma";

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function upsertCover(tx: Tx, entityId: string, url: string | null | undefined) {
  if (url === undefined) return;
  await tx.image.deleteMany({ where: { entityType: "COLLECTION", entityId, type: "cover" } });
  if (url) {
    await tx.image.create({ data: { entityType: "COLLECTION", entityId, type: "cover", url } });
  }
}

export async function createCollectionService(data: {
  title: string;
  description?: string;
  destinationId: string;
  type?: string;
  placeIds: string[];
  coverImage?: string;
  status?: "DRAFT" | "PUBLISHED";
}) {
  const { coverImage, placeIds, ...rest } = data;
  return await prisma.$transaction(async (tx) => {
    const destination = await tx.destination.findUnique({ where: { id: rest.destinationId } });
    if (!destination) throw new Error("Destination not found");

    const places = await tx.place.findMany({
      where: { id: { in: placeIds }, destinationId: rest.destinationId },
      select: { id: true },
    });
    if (places.length !== placeIds.length) {
      throw new Error("Some places are invalid or do not belong to the selected destination");
    }

    const collection = await tx.collection.create({ data: rest });

    await tx.collectionItem.createMany({
      data: placeIds.map((placeId, index) => ({ collectionId: collection.id, placeId, position: index + 1 })),
    });

    await upsertCover(tx, collection.id, coverImage);

    const cover = await tx.image.findFirst({ where: { entityType: "COLLECTION", entityId: collection.id, type: "cover" } });
    return { ...collection, coverImage: cover?.url ?? null };
  });
}

export async function getCollectionsService(params: {
  destinationId?: string | null;
  type?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}) {
  const { destinationId, type, search, page = 1, limit = 20 } = params;

  const where = {
    ...(destinationId ? { destinationId } : {}),
    ...(type ? { type } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [total, collections] = await Promise.all([
    prisma.collection.count({ where }),
    prisma.collection.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        destination: { select: { id: true, name: true } },
        collectionItems: {
          orderBy: { position: "asc" },
          include: { place: true },
        },
      },
    }),
  ]);

  if (!collections.length) {
    return { data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
  }

  const collectionIds = collections.map((c) => c.id);
  const placeIds = collections.flatMap((col) => col.collectionItems.map((item) => item.place.id));

  const [collectionCovers, placeImages] = await Promise.all([
    prisma.image.findMany({ where: { entityType: "COLLECTION", entityId: { in: collectionIds }, type: "cover" }, select: { entityId: true, url: true } }),
    prisma.image.findMany({ where: { entityType: "PLACE", entityId: { in: placeIds }, type: "cover" } }),
  ]);

  const coverMap: Record<string, string> = {};
  for (const c of collectionCovers) coverMap[c.entityId] = c.url;

  const placeImageMap: Record<string, any> = {};
  for (const img of placeImages) placeImageMap[img.entityId] = img;

  const data = collections.map((col) => ({
    id: col.id,
    title: col.title,
    description: col.description,
    type: col.type,
    destination: col.destination,
    createdAt: col.createdAt,
    coverImage: coverMap[col.id] ?? null,
    places: col.collectionItems.map((item) => ({
      ...item.place,
      cover: placeImageMap[item.place.id] || null,
      position: item.position,
    })),
  }));

  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getCollectionByIdService(id: string) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, type: true } },
      collectionItems: {
        orderBy: { position: "asc" },
        include: { place: true },
      },
    },
  });

  if (!collection) throw new Error("Collection not found");

  const placeIds = collection.collectionItems.map((item) => item.place.id);

  const [collectionCover, placeImages] = await Promise.all([
    prisma.image.findFirst({ where: { entityType: "COLLECTION", entityId: id, type: "cover" } }),
    placeIds.length
      ? prisma.image.findMany({ where: { entityType: "PLACE", entityId: { in: placeIds } }, orderBy: { position: "asc" } })
      : Promise.resolve([]),
  ]);

  const imageMap: Record<string, any[]> = {};
  for (const img of placeImages) {
    if (!imageMap[img.entityId]) imageMap[img.entityId] = [];
    imageMap[img.entityId].push(img);
  }

  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    type: collection.type,
    destination: collection.destination,
    coverImage: collectionCover?.url ?? null,
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
  const { coverImage, ...rest } = data;
  return await prisma.$transaction(async (tx) => {
    const collection = await tx.collection.findUnique({ where: { id } });
    if (!collection) throw new Error("Collection not found");

    const updated = await tx.collection.update({ where: { id }, data: rest });

    await upsertCover(tx, id, coverImage);

    if (removePlaceIds.length) {
      await tx.collectionItem.deleteMany({ where: { collectionId: id, placeId: { in: removePlaceIds } } });
    }

    if (addPlaceIds.length) {
      await tx.collectionItem.createMany({
        data: addPlaceIds.map((placeId, index) => ({ collectionId: id, placeId, position: index + 1 })),
        skipDuplicates: true,
      });
    }

    if (orderedPlaceIds.length) {
      for (let i = 0; i < orderedPlaceIds.length; i++) {
        await tx.collectionItem.updateMany({
          where: { collectionId: id, placeId: orderedPlaceIds[i] },
          data: { position: i + 1 },
        });
      }
    }

    const cover = await tx.image.findFirst({ where: { entityType: "COLLECTION", entityId: id, type: "cover" } });
    return { ...updated, coverImage: cover?.url ?? null };
  });
}

export async function deleteCollectionService(id: string) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.collection.findUnique({ where: { id } });
    if (!existing) throw new Error("Collection not found");
    await tx.image.deleteMany({ where: { entityType: "COLLECTION", entityId: id } });
    await tx.collection.delete({ where: { id } });
    return { success: true };
  });
}
