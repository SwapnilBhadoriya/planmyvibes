import prisma from "@/lib/prisma";
import {
    ItineraryInput,
    ItineraryUpdateInput,
    ItinerarySyncInput,
    DayInput,
    DayUpdateInput,
    ActivityInput,
    ActivityUpdateInput,
} from "@/lib/validations/itinerary.schema";

const ITINERARY_LIST_INCLUDE = {
    itineraryDestinations: {
        orderBy: { position: "asc" as const },
        include: {
            destination: { select: { id: true, name: true, slug: true, type: true } },
        },
    },
} as const;

const ITINERARY_FULL_INCLUDE = {
    itineraryDestinations: {
        orderBy: { position: "asc" as const },
        include: {
            destination: { select: { id: true, name: true, slug: true, type: true } },
        },
    },
    itineraryDays: {
        orderBy: { dayNumber: "asc" as const },
        include: {
            destination: { select: { id: true, name: true, slug: true } },
            activities: {
                orderBy: { position: "asc" as const },
                include: {
                    activePlaces: {
                        include: {
                            place: { select: { id: true, name: true, type: true } },
                        },
                    },
                    transports: true,
                },
            },
        },
    },
} as const;

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

function parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
}

// Shared helper — used by both create and update
async function createDaysWithActivities(tx: Tx, itineraryId: string, days: DayInput[]) {
    for (const day of days) {
        if (day.destinationId) {
            const dest = await tx.destination.findUnique({
                where: { id: day.destinationId },
                select: { id: true },
            });
            if (!dest)
                throw new Error(
                    `Destination not found for day ${day.dayNumber}: ${day.destinationId}`
                );
        }

        const itineraryDay = await tx.itineraryDay.create({
            data: {
                itineraryId,
                dayNumber: day.dayNumber,
                title: day.title,
                destinationId: day.destinationId,
            },
        });

        for (const activity of day.activities ?? []) {
            const created = await tx.activity.create({
                data: {
                    dayId: itineraryDay.id,
                    title: activity.title,
                    activityType: activity.activityType,
                    startTime: activity.startTime ? parseTime(activity.startTime) : undefined,
                    endTime: activity.endTime ? parseTime(activity.endTime) : undefined,
                    position: activity.position,
                    notes: activity.notes,
                    isOptional: activity.isOptional,
                },
            });

            // Places
            if (activity.placeIds?.length) {
                const foundPlaces = await tx.place.findMany({
                    where: { id: { in: activity.placeIds } },
                    select: { id: true },
                });
                const foundSet = new Set(foundPlaces.map((p) => p.id));
                const missing = activity.placeIds.find((id) => !foundSet.has(id));
                if (missing) throw new Error(`Place not found: ${missing}`);

                await tx.activityPlace.createMany({
                    data: activity.placeIds.map((placeId) => ({
                        activityId: created.id,
                        placeId,
                    })),
                });
            }

            // Transports
            for (const transport of activity.transports ?? []) {
                if (transport.fromPlaceId) {
                    const fromPlace = await tx.place.findUnique({
                        where: { id: transport.fromPlaceId },
                        select: { id: true },
                    });
                    if (!fromPlace)
                        throw new Error(`From-place not found: ${transport.fromPlaceId}`);
                }
                if (transport.toPlaceId) {
                    const toPlace = await tx.place.findUnique({
                        where: { id: transport.toPlaceId },
                        select: { id: true },
                    });
                    if (!toPlace)
                        throw new Error(`To-place not found: ${transport.toPlaceId}`);
                }
                await tx.transport.create({
                    data: {
                        activityId: created.id,
                        mode: transport.mode,
                        provider: transport.provider,
                        fromPlaceId: transport.fromPlaceId,
                        toPlaceId: transport.toPlaceId,
                        durationMinutes: transport.durationMinutes,
                        distanceKm: transport.distanceKm,
                        cost: transport.cost,
                        notes: transport.notes,
                    },
                });
            }

            // Tips
            if (activity.tips?.length) {
                await tx.tip.createMany({
                    data: activity.tips.map((tip) => ({
                        entityType: "ACTIVITY",
                        entityId: created.id,
                        type: tip.type,
                        content: tip.content,
                    })),
                });
            }

            // Images
            if (activity.images?.length) {
                await tx.image.createMany({
                    data: activity.images.map((img, idx) => ({
                        url: img.url,
                        altText: img.altText,
                        entityType: "ACTIVITY",
                        entityId: created.id,
                        type: img.type,
                        isPrimary: img.isPrimary,
                        position: img.position ?? idx + 1,
                    })),
                });
            }
        }
    }
}

// Wipes all days for an itinerary and cleans up polymorphic records first
async function deleteDaysWithActivities(tx: Tx, itineraryId: string) {
    const existingDays = await tx.itineraryDay.findMany({
        where: { itineraryId },
        select: { activities: { select: { id: true } } },
    });

    const activityIds = existingDays.flatMap((d) => d.activities.map((a) => a.id));

    if (activityIds.length) {
        await tx.tip.deleteMany({
            where: { entityType: "ACTIVITY", entityId: { in: activityIds } },
        });
        await tx.image.deleteMany({
            where: { entityType: "ACTIVITY", entityId: { in: activityIds } },
        });
    }

    // Cascade handles: activities, activityPlaces, transports
    await tx.itineraryDay.deleteMany({ where: { itineraryId } });
}

export async function createItineraryService(data: ItineraryInput) {
    return await prisma.$transaction(async (tx) => {
        const itinerary = await tx.itinerary.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                durationDays: data.durationDays,
                budgetMin: data.budgetMin,
                budgetMax: data.budgetMax,
                currency: data.currency,
                tripType: data.tripType,
                difficulty: data.difficulty,
                travelMode: data.travelMode,
                stayNights: data.stayNights,
                minPeople: data.minPeople,
                maxPeople: data.maxPeople,
                totalPlaces: data.totalPlaces,
                estimatedBudget: data.estimatedBudget,
            },
        });

        if (data.destinationIds?.length) {
            const ids = data.destinationIds.map((d) => d.destinationId);
            const found = await tx.destination.findMany({
                where: { id: { in: ids } },
                select: { id: true },
            });
            const foundSet = new Set(found.map((d) => d.id));
            const missing = ids.find((id) => !foundSet.has(id));
            if (missing) throw new Error(`Destination not found: ${missing}`);

            await tx.itineraryDestination.createMany({
                data: data.destinationIds.map((d) => ({
                    itineraryId: itinerary.id,
                    destinationId: d.destinationId,
                    position: d.position,
                })),
            });
        }

        if (data.days?.length) {
            await createDaysWithActivities(tx, itinerary.id, data.days);
        }

        return await tx.itinerary.findUnique({
            where: { id: itinerary.id },
            include: ITINERARY_FULL_INCLUDE,
        });
    });
}

export async function getItinerariesService(params: {
    tripType?: string;
    difficulty?: string;
    travelMode?: string;
    destinationId?: string;
    page?: number;
    limit?: number;
}) {
    const { tripType, difficulty, travelMode, destinationId, page = 1, limit = 20 } = params;

    const where: any = {
        ...(tripType ? { tripType: tripType as any } : {}),
        ...(difficulty ? { difficulty: difficulty as any } : {}),
        ...(travelMode ? { travelMode: travelMode as any } : {}),
        ...(destinationId ? { itineraryDestinations: { some: { destinationId } } } : {}),
    };

    const [total, itineraries] = await Promise.all([
        prisma.itinerary.count({ where }),
        prisma.itinerary.findMany({
            where,
            include: ITINERARY_LIST_INCLUDE,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);

    return {
        data: itineraries,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}

export async function getItineraryByIdService(id: string) {
    const itinerary = await prisma.itinerary.findUnique({
        where: { id },
        include: ITINERARY_FULL_INCLUDE,
    });

    if (!itinerary) throw new Error("Itinerary not found");

    const activityIds = itinerary.itineraryDays.flatMap((day) =>
        day.activities.map((a) => a.id)
    );

    const tips = activityIds.length
        ? await prisma.tip.findMany({
              where: { entityType: "ACTIVITY", entityId: { in: activityIds } },
          })
        : ([] as Awaited<ReturnType<typeof prisma.tip.findMany>>);

    const images = activityIds.length
        ? await prisma.image.findMany({
              where: { entityType: "ACTIVITY", entityId: { in: activityIds } },
              orderBy: { position: "asc" },
          })
        : ([] as Awaited<ReturnType<typeof prisma.image.findMany>>);

    const tipsMap: Record<string, typeof tips> = {};
    const imagesMap: Record<string, typeof images> = {};

    for (const tip of tips) {
        if (!tipsMap[tip.entityId]) tipsMap[tip.entityId] = [];
        tipsMap[tip.entityId].push(tip);
    }
    for (const img of images) {
        if (!imagesMap[img.entityId]) imagesMap[img.entityId] = [];
        imagesMap[img.entityId].push(img);
    }

    return {
        ...itinerary,
        itineraryDays: itinerary.itineraryDays.map((day) => ({
            ...day,
            activities: day.activities.map((activity) => ({
                ...activity,
                tips: tipsMap[activity.id] ?? [],
                images: imagesMap[activity.id] ?? [],
            })),
        })),
    };
}



// ─── Sync ─────────────────────────────────────────────────────────────────────

type SyncActivity = NonNullable<NonNullable<ItinerarySyncInput["days"]>[number]["activities"]>[number];

async function syncActivitySubResources(tx: Tx, activityId: string, activity: SyncActivity) {
    // ── Places ──────────────────────────────────────────────────────────────
    if (activity.placeIds !== undefined) {
        const existing = await tx.activityPlace.findMany({
            where: { activityId },
            select: { placeId: true },
        });
        const existingIds = existing.map((p) => p.placeId);
        const toAdd    = activity.placeIds.filter((id) => !existingIds.includes(id));
        const toRemove = existingIds.filter((id) => !activity.placeIds!.includes(id));

        if (toRemove.length)
            await tx.activityPlace.deleteMany({ where: { activityId, placeId: { in: toRemove } } });

        if (toAdd.length) {
            const found = await tx.place.findMany({ where: { id: { in: toAdd } }, select: { id: true } });
            const foundSet = new Set(found.map((p) => p.id));
            const missing = toAdd.find((id) => !foundSet.has(id));
            if (missing) throw new Error(`Place not found: ${missing}`);
            await tx.activityPlace.createMany({
                data: toAdd.map((placeId) => ({ activityId, placeId })),
                skipDuplicates: true,
            });
        }
    }

    // ── Transports ──────────────────────────────────────────────────────────
    if (activity.transports !== undefined) {
        const existing    = await tx.transport.findMany({ where: { activityId }, select: { id: true } });
        const existingIds = new Set(existing.map((t) => t.id));
        const payloadIds  = new Set(activity.transports.filter((t) => t.id).map((t) => t.id!));

        // Delete removed
        const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
        if (toDelete.length) await tx.transport.deleteMany({ where: { id: { in: toDelete } } });

        for (const t of activity.transports) {
            if (t.fromPlaceId) {
                const p = await tx.place.findUnique({ where: { id: t.fromPlaceId } });
                if (!p) throw new Error(`From-place not found: ${t.fromPlaceId}`);
            }
            if (t.toPlaceId) {
                const p = await tx.place.findUnique({ where: { id: t.toPlaceId } });
                if (!p) throw new Error(`To-place not found: ${t.toPlaceId}`);
            }
            const { id, ...fields } = t;
            if (id && existingIds.has(id)) {
                // Update existing
                await tx.transport.update({ where: { id }, data: fields });
            } else if (!id) {
                // Create new
                await tx.transport.create({ data: { activityId, ...fields } });
            }
        }
    }

    // ── Tips ────────────────────────────────────────────────────────────────
    if (activity.tips !== undefined) {
        const existing    = await tx.tip.findMany({ where: { entityType: "ACTIVITY", entityId: activityId }, select: { id: true } });
        const existingIds = new Set(existing.map((t) => t.id));
        const payloadIds  = new Set(activity.tips.filter((t) => t.id).map((t) => t.id!));

        const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
        if (toDelete.length) await tx.tip.deleteMany({ where: { id: { in: toDelete } } });

        for (const tip of activity.tips) {
            const { id, ...fields } = tip;
            if (id && existingIds.has(id)) {
                await tx.tip.update({ where: { id }, data: fields });
            } else if (!id) {
                await tx.tip.create({ data: { entityType: "ACTIVITY", entityId: activityId, ...fields } });
            }
        }
    }

    // ── Images ──────────────────────────────────────────────────────────────
    if (activity.images !== undefined) {
        const existing    = await tx.image.findMany({ where: { entityType: "ACTIVITY", entityId: activityId }, select: { id: true } });
        const existingIds = new Set(existing.map((i) => i.id));
        const payloadIds  = new Set(activity.images.filter((i) => i.id).map((i) => i.id!));

        const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
        if (toDelete.length) await tx.image.deleteMany({ where: { id: { in: toDelete } } });

        for (const [idx, img] of activity.images.entries()) {
            const { id, ...fields } = img;
            if (id && existingIds.has(id)) {
                await tx.image.update({ where: { id }, data: { altText: fields.altText, isPrimary: fields.isPrimary, position: fields.position } });
            } else if (!id) {
                await tx.image.create({
                    data: { entityType: "ACTIVITY", entityId: activityId, ...fields, position: fields.position ?? idx + 1 },
                });
            }
        }
    }
}

async function syncDayActivities(tx: Tx, dayId: number, activities: SyncActivity[]) {
    const existing    = await tx.activity.findMany({ where: { dayId }, select: { id: true } });
    const existingIds = new Set(existing.map((a) => a.id));
    const payloadIds  = new Set(activities.filter((a) => a.id).map((a) => a.id!));

    // Delete activities removed from payload
    const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
    if (toDelete.length) {
        await tx.tip.deleteMany({ where: { entityType: "ACTIVITY", entityId: { in: toDelete } } });
        await tx.image.deleteMany({ where: { entityType: "ACTIVITY", entityId: { in: toDelete } } });
        await tx.activity.deleteMany({ where: { id: { in: toDelete } } });
    }

    for (const activity of activities) {
        const { id, placeIds, transports, tips, images, startTime, endTime, ...fields } = activity;

        if (id && existingIds.has(id)) {
            // Update existing activity scalar fields
            await tx.activity.update({
                where: { id },
                data: {
                    ...fields,
                    ...(startTime ? { startTime: parseTime(startTime) } : {}),
                    ...(endTime   ? { endTime:   parseTime(endTime)   } : {}),
                },
            });
            await syncActivitySubResources(tx, id, activity);
        } else if (!id) {
            // Create new activity
            const created = await tx.activity.create({
                data: {
                    dayId,
                    ...fields,
                    isOptional: fields.isOptional ?? false,
                    ...(startTime ? { startTime: parseTime(startTime) } : {}),
                    ...(endTime   ? { endTime:   parseTime(endTime)   } : {}),
                },
            });
            // Sub-resources for new activities — treat everything as "add"
            await syncActivitySubResources(tx, created.id, activity);
        } else {
            throw new Error(`Activity ${id} does not belong to day ${dayId}`);
        }
    }
}

export async function syncItineraryService(id: string, data: ItinerarySyncInput) {
    const existing = await prisma.itinerary.findUnique({ where: { id } });
    if (!existing) throw new Error("Itinerary not found");

    const { destinationIds, days, ...fields } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Update top-level itinerary fields
        await tx.itinerary.update({ where: { id }, data: fields as any });

        // 2. Destinations — full replacement when provided
        if (destinationIds !== undefined) {
            if (destinationIds.length) {
                const destIds = destinationIds.map((d) => d.destinationId);
                const found   = await tx.destination.findMany({ where: { id: { in: destIds } }, select: { id: true } });
                const foundSet = new Set(found.map((d) => d.id));
                const missing  = destIds.find((did) => !foundSet.has(did));
                if (missing) throw new Error(`Destination not found: ${missing}`);
            }
            await tx.itineraryDestination.deleteMany({ where: { itineraryId: id } });
            if (destinationIds.length) {
                await tx.itineraryDestination.createMany({
                    data: destinationIds.map((d) => ({
                        itineraryId: id,
                        destinationId: d.destinationId,
                        position: d.position,
                    })),
                });
            }
        }

        // 3. Days — diff-based sync
        if (days !== undefined) {
            const existingDays = await tx.itineraryDay.findMany({
                where: { itineraryId: id },
                select: { id: true, activities: { select: { id: true } } },
            });
            const existingDayIds = new Set(existingDays.map((d) => d.id));
            const payloadDayIds  = new Set(days.filter((d) => d.id).map((d) => d.id!));

            // Delete days removed from payload
            const daysToDelete = existingDays.filter((d) => !payloadDayIds.has(d.id));
            if (daysToDelete.length) {
                const activityIds = daysToDelete.flatMap((d) => d.activities.map((a) => a.id));
                if (activityIds.length) {
                    await tx.tip.deleteMany({ where: { entityType: "ACTIVITY", entityId: { in: activityIds } } });
                    await tx.image.deleteMany({ where: { entityType: "ACTIVITY", entityId: { in: activityIds } } });
                }
                await tx.itineraryDay.deleteMany({ where: { id: { in: daysToDelete.map((d) => d.id) } } });
            }

            for (const day of days) {
                const { id: dayId, activities, ...dayFields } = day;

                if (dayId && existingDayIds.has(dayId)) {
                    // Update existing day
                    await tx.itineraryDay.update({ where: { id: dayId }, data: dayFields });
                    if (activities !== undefined) {
                        await syncDayActivities(tx, dayId, activities);
                    }
                } else if (!dayId) {
                    // Create new day
                    const newDay = await tx.itineraryDay.create({
                        data: { itineraryId: id, ...dayFields },
                    });
                    if (activities?.length) {
                        await syncDayActivities(tx, newDay.id, activities);
                    }
                } else {
                    throw new Error(`Day ${dayId} does not belong to this itinerary`);
                }
            }
        }

        return await tx.itinerary.findUnique({ where: { id }, include: ITINERARY_FULL_INCLUDE });
    });
}

export async function deleteItineraryService(id: string) {
    const itinerary = await prisma.itinerary.findUnique({ where: { id } });
    if (!itinerary) throw new Error("Itinerary not found");

    await prisma.$transaction(async (tx) => {
        await deleteDaysWithActivities(tx, id);

        await tx.tip.deleteMany({ where: { entityType: "ITINERARY", entityId: id } });
        await tx.image.deleteMany({ where: { entityType: "ITINERARY", entityId: id } });

        // Cascade handles: itineraryDestinations, itineraryDays, activities,
        // activityPlaces, transports
        await tx.itinerary.delete({ where: { id } });
    });

    return { success: true };
}
