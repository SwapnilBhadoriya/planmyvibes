import { type ItineraryFormValues } from "./itinerary-form";

function clean<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
    ) as Partial<T>;
}

function transportPayload(t: any) {
    const { fromPlaceName, toPlaceName, ...rest } = t;
    return clean(rest);
}

function activityPayload(act: any, ai: number) {
    const transports = act.transports.map(transportPayload);
    const validTips = (act.tips ?? []).filter((t: any) => t.content?.trim());
    const tips = validTips.map((t: any) => ({
        ...clean({ type: t.type, content: t.content }),
        ...(t._dbId ? { id: t._dbId } : {}),
    }));

    return {
        ...(act._dbId ? { id: act._dbId } : {}),
        ...clean({
            title: act.title,
            activityType: act.activityType,
            startTime: act.startTime,
            durationMinutes: act.durationMinutes,
            notes: act.notes,
        }),
        isOptional: act.isOptional ?? false,
        position: ai + 1,
        placeIds: act.placeIds.length ? act.placeIds : undefined,
        transports: transports.length ? transports : undefined,
        tips: tips.length ? tips : undefined,
    };
}

function dayPayload(day: any, di: number) {
    return {
        ...(day._dbId ? { id: day._dbId } : {}),
        dayNumber: di + 1,
        ...clean({ title: day.title, coverImageUrl: day.coverImageUrl, destinationId: day.destinationId }),
        activities: day.activities.map((act: any, ai: number) => activityPayload(act, ai)),
    };
}

export function toPayload(values: ItineraryFormValues) {
    return {
        ...clean({
            title: values.title,
            subtitle: values.subtitle,
            description: values.description,
            durationDays: values.durationDays,
            budgetMin: values.budgetMin,
            budgetMax: values.budgetMax,
            currency: values.currency,
            tripType: values.tripType,
            difficulty: values.difficulty,
            travelMode: values.travelMode,
            stayNights: values.stayNights,
            minPeople: values.minPeople,
            maxPeople: values.maxPeople,
            estimatedBudget: values.estimatedBudget,
        }),
        destinationIds: values.destinationIds.map(({ destinationId, position }) => ({ destinationId, position })),
        days: values.days.map((day, di) => dayPayload(day, di)),
    };
}
