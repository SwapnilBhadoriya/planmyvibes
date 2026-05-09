"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ItineraryForm, type ItineraryFormValues, type DayItem, type ActivityItem } from "../../components/itinerary-form";
import { toPayload } from "../../components/itinerary-payload";
import { syncTags } from "@/components/admin/tag-input";

function apiToFormDays(apiDays: any[]): DayItem[] {
    return apiDays.map((day) => ({
        _key: String(day.id),
        _dbId: day.id,
        dayNumber: day.dayNumber,
        title: day.title ?? "",
        coverImageUrl: day.coverImageUrl ?? undefined,
        destinationId: day.destination?.id,
        destinationName: day.destination?.name,
        activities: (day.activities ?? []).map((act: any): ActivityItem & { _dbId?: string } => {
            const placeNames: Record<string, string> = {};
            (act.activePlaces ?? []).forEach((ap: any) => {
                placeNames[ap.place.id] = ap.place.name;
            });
            return {
                _key: act.id,
                _dbId: act.id,
                title: act.title ?? "",
                activityType: act.activityType ?? "",
                startTime: act.startTime ?? undefined,
                durationMinutes: act.durationMinutes ?? undefined,
                notes: act.notes ?? "",
                isOptional: act.isOptional ?? false,
                placeIds: (act.activePlaces ?? []).map((ap: any) => ap.place.id),
                placeNames,
                transports: (act.transports ?? []).map((t: any) => ({
                    mode: t.mode,
                    provider: t.provider,
                    fromPlaceId: t.fromPlaceId,
                    toPlaceId: t.toPlaceId,
                    durationMinutes: t.durationMinutes,
                    distanceKm: t.distanceKm ? Number(t.distanceKm) : undefined,
                    cost: t.cost,
                    notes: t.notes,
                })),
                tips: (act.tips ?? []).map((t: any) => ({
                    _key: t.id,
                    _dbId: t.id,
                    type: t.type,
                    content: t.content,
                })),
            };
        }),
    }));
}

export default function EditItineraryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [initialData, setInitialData] = useState<ItineraryFormValues | null>(null);
    const [initialStatus, setInitialStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        fetch(`/api/itineraries/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                const d = json.data;
                setInitialData({
                    title: d.title ?? "",
                    subtitle: d.subtitle ?? "",
                    description: d.description ?? "",
                    durationDays: d.durationDays,
                    budgetMin: d.budgetMin,
                    budgetMax: d.budgetMax,
                    currency: d.currency ?? "INR",
                    tripType: d.tripType ?? "",
                    difficulty: d.difficulty ?? "",
                    travelMode: d.travelMode ?? "",
                    stayNights: d.stayNights,
                    minPeople: d.minPeople,
                    maxPeople: d.maxPeople,
                    estimatedBudget: d.estimatedBudget,
                    destinationIds: (d.itineraryDestinations ?? []).map((dest: any) => ({
                        destinationId: dest.destination.id,
                        destinationName: dest.destination.name,
                        position: dest.position ?? 1,
                    })),
                    days: apiToFormDays(d.itineraryDays ?? []),
                });
                setInitialStatus(d.status ?? "DRAFT");
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(values: ItineraryFormValues, status: "DRAFT" | "PUBLISHED") {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/itineraries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...toPayload(values), status }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update itinerary");
            await syncTags("ITINERARY", id, tags);
            router.push(`/admin/itineraries/${id}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-9 w-20" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (notFound || !initialData) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Itinerary not found</p>
                <Button asChild variant="outline"><Link href="/admin/itineraries">Back to list</Link></Button>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title={`Edit: ${initialData.title || "Untitled Itinerary"}`}
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/itineraries/${id}`}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <ItineraryForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                cancelHref={`/admin/itineraries/${id}`}
                tags={tags}
                onTagsChange={setTags}
                entityId={id}
                initialStatus={initialStatus}
            />
        </div>
    );
}
