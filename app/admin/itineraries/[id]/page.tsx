"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, MapPin, Clock, Car } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";

const TRIP_TYPE_COLORS: Record<string, string> = {
    solo: "bg-purple-50 text-purple-700 border-purple-200",
    couple: "bg-pink-50 text-pink-700 border-pink-200",
    family: "bg-orange-50 text-orange-700 border-orange-200",
    group: "bg-blue-50 text-blue-700 border-blue-200",
};

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: "bg-green-50 text-green-700 border-green-200",
    moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
};

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
    sightseeing: "bg-sky-50 text-sky-700 border-sky-200",
    food: "bg-orange-50 text-orange-700 border-orange-200",
    travel: "bg-slate-50 text-slate-700 border-slate-200",
    adventure: "bg-red-50 text-red-700 border-red-200",
    relaxation: "bg-teal-50 text-teal-700 border-teal-200",
    shopping: "bg-pink-50 text-pink-700 border-pink-200",
    other: "bg-muted text-muted-foreground",
};


export default function ViewItineraryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/itineraries/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setData(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/itineraries/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            router.push("/admin/itineraries");
        } catch (e: any) {
            setDeleteError(e.message);
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-9 w-40" />
                </div>
                <Skeleton className="mb-4 h-6 w-48" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (notFound || !data) {
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
                title={data.title ?? "Untitled Itinerary"}
                subtitle={data.subtitle}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/itineraries"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/admin/itineraries/${id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                        </Button>
                    </div>
                }
            />

            {deleteError && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {deleteError}
                </div>
            )}

            {/* Meta badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                {data.tripType && <Badge variant="outline" className={TRIP_TYPE_COLORS[data.tripType]}>{data.tripType}</Badge>}
                {data.difficulty && <Badge variant="outline" className={DIFFICULTY_COLORS[data.difficulty]}>{data.difficulty}</Badge>}
                {data.travelMode && <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{data.travelMode}</Badge>}
                {data.durationDays && <span className="text-sm text-muted-foreground">{data.durationDays} days</span>}
                {(data.budgetMin || data.budgetMax) && (
                    <span className="text-sm text-muted-foreground">
                        ₹{data.budgetMin?.toLocaleString()} – ₹{data.budgetMax?.toLocaleString()} {data.currency}
                    </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(data.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            </div>

            {/* Destinations */}
            {data.itineraryDestinations?.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {data.itineraryDestinations.map((d: any) => (
                        <Link key={d.destination.id} href={`/admin/destinations/${d.destination.id}`}
                            className="text-sm font-medium hover:underline">
                            {d.destination.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Description */}
            {data.description && (
                <div className="mb-5 rounded-xl border border-border bg-white p-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{data.description}</p>
                </div>
            )}

            {/* Days */}
            {(data.itineraryDays ?? []).length > 0 && (
                <div className="space-y-5">
                    {data.itineraryDays.map((day: any) => (
                        <div key={day.id} className="rounded-xl border border-border bg-white overflow-hidden">
                            {/* Day cover image */}
                            {day.coverImageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={day.coverImageUrl} alt={day.title ?? `Day ${day.dayNumber}`} className="h-40 w-full object-cover" />
                            )}
                            {/* Day header */}
                            <div className="flex items-center gap-3 bg-muted/40 border-b border-border px-5 py-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    {day.dayNumber}
                                </span>
                                <div>
                                    <p className="font-semibold text-sm">{day.title ?? `Day ${day.dayNumber}`}</p>
                                    {day.destination && (
                                        <Link href={`/admin/destinations/${day.destination.id}`} className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />{day.destination.name}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Activities */}
                            {(day.activities ?? []).length > 0 ? (
                                <div className="divide-y divide-border">
                                    {day.activities.map((act: any, ai: number) => (
                                        <div key={act.id} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground mt-0.5">
                                                    {ai + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <p className="font-medium text-sm">{act.title ?? "Untitled activity"}</p>
                                                        {act.activityType && (
                                                            <Badge variant="outline" className={`text-xs ${ACTIVITY_TYPE_COLORS[act.activityType] ?? ""}`}>
                                                                {act.activityType}
                                                            </Badge>
                                                        )}
                                                        {act.isOptional && <Badge variant="outline" className="text-xs text-muted-foreground">Optional</Badge>}
                                                    </div>

                                                    {(act.startTime || act.durationMinutes) && (
                                                        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {act.startTime && <span>{act.startTime}</span>}
                                                            {act.startTime && act.durationMinutes && <span>·</span>}
                                                            {act.durationMinutes && <span>{act.durationMinutes} min</span>}
                                                        </div>
                                                    )}

                                                    {act.notes && <p className="text-xs text-muted-foreground mb-2">{act.notes}</p>}

                                                    {/* Places */}
                                                    {act.activePlaces?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {act.activePlaces.map((ap: any) => (
                                                                <Link key={ap.place.id} href={`/admin/places/${ap.place.id}`}
                                                                    className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20">
                                                                    <MapPin className="h-2.5 w-2.5" />{ap.place.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Transports */}
                                                    {act.transports?.length > 0 && (
                                                        <div className="mt-2 space-y-1.5">
                                                            {act.transports.map((t: any) => (
                                                                <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                                                                    <Car className="h-3 w-3 text-muted-foreground" />
                                                                    {t.mode && <span className="font-medium capitalize">{t.mode}</span>}
                                                                    {t.provider && <span className="text-muted-foreground">· {t.provider}</span>}
                                                                    {t.durationMinutes && <span className="text-muted-foreground">· {t.durationMinutes} min</span>}
                                                                    {t.distanceKm && <span className="text-muted-foreground">· {t.distanceKm} km</span>}
                                                                    {t.cost && <span className="text-muted-foreground">· ₹{t.cost}</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Tips */}
                                                    {act.tips?.length > 0 && (
                                                        <ul className="mt-2 list-disc pl-4 space-y-0.5">
                                                            {act.tips.map((tip: any) => (
                                                                <li key={tip.id} className="text-xs text-muted-foreground">{tip.content}</li>
                                                            ))}
                                                        </ul>
                                                    )}

</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="px-5 py-4 text-sm text-muted-foreground italic">No activities for this day.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete itinerary"
                description={`Delete "${data.title ?? "this itinerary"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
