"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Star, MapPin, ExternalLink, Clock, DollarSign } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { type PlaceDetail } from "../components/place-columns";

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function ViewPlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [place, setPlace] = useState<PlaceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/places/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setPlace(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            router.push("/admin/places");
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
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <Skeleton className="mb-5 aspect-video w-full max-w-2xl rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        );
    }

    if (notFound || !place) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Place not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/places">Back to list</Link>
                </Button>
            </div>
        );
    }

    const duration = place.durationMinutes
        ? place.durationMinutes >= 60
            ? `${Math.floor(place.durationMinutes / 60)}h ${place.durationMinutes % 60 > 0 ? `${place.durationMinutes % 60}m` : ""}`.trim()
            : `${place.durationMinutes}m`
        : null;

    const price = (() => {
        if (place.priceMin && place.priceMax) return `₹${place.priceMin.toLocaleString("en-IN")} – ₹${place.priceMax.toLocaleString("en-IN")}`;
        if (place.priceMin) return `From ₹${place.priceMin.toLocaleString("en-IN")}`;
        if (place.priceMax) return `Up to ₹${place.priceMax.toLocaleString("en-IN")}`;
        return null;
    })();

    return (
        <div>
            <AdminPageHeader
                title={place.name}
                subtitle={place.destination?.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/places">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/admin/places/${id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                }
            />

            {deleteError && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {deleteError}
                </div>
            )}

            {/* Badges row */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                {place.type && (
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        {place.type}
                    </Badge>
                )}
                {place.rating && (
                    <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {Number(place.rating).toFixed(1)}
                    </span>
                )}
                {place.destination && (
                    <Link
                        href={`/admin/destinations/${place.destination.id}`}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        {place.destination.name}
                    </Link>
                )}
            </div>

            {/* Cover image */}
            {place.cover && (
                <div className="mb-5">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Cover</p>
                    <div className="overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16/9", maxWidth: "640px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={place.cover.url} alt="Cover" className="h-full w-full object-cover" />
                    </div>
                </div>
            )}

            {/* Gallery */}
            {place.gallery && place.gallery.length > 0 && (
                <div className="mb-5">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Gallery
                        <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                            {place.gallery.length}
                        </span>
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {place.gallery.map((img) => (
                            <div key={img.id} className="overflow-hidden rounded-lg border border-border" style={{ aspectRatio: "4/3" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Details */}
            <div className="mb-5 rounded-xl border border-border bg-white p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold">Details</h3>
                <div className="space-y-3">
                    <InfoRow label="Type" value={place.type} />
                    <InfoRow
                        label="Rating"
                        value={
                            place.rating
                                ? Number(place.rating).toFixed(1)
                                : "-"
                        }
                    />
                    {price && (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                            <span className="w-44 shrink-0 text-sm text-muted-foreground">Price</span>
                            <span className="flex items-center gap-1 text-sm font-medium">
                                
                                {price}
                            </span>
                        </div>
                    )}
                    {duration && (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                            <span className="w-44 shrink-0 text-sm text-muted-foreground">Duration</span>
                            <span className="flex items-center gap-1 text-sm font-medium">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                {duration}
                            </span>
                        </div>
                    )}
                    {place.address && <InfoRow label="Address" value={place.address} />}
                    {place.googleMapsLink && (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                            <span className="w-44 shrink-0 text-sm text-muted-foreground">Google Maps</span>
                            <a
                                href={place.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                            >
                                Open in Maps
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {place.description && (
                <div className="mb-5 rounded-xl border border-border bg-white p-5 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold">Description</h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{place.description}</p>
                </div>
            )}

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete place"
                description={`Delete "${place.name}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
