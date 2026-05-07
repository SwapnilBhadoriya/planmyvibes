"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { type DestinationDetail, type DestinationType } from "../components/destination-columns";
import { MONTHS_SHORT } from "@/lib/constants";

const TYPE_STYLES: Record<DestinationType, string> = {
    country: "bg-blue-100 text-blue-700 border-blue-200",
    state: "bg-green-100 text-green-700 border-green-200",
    city: "bg-orange-100 text-orange-700 border-orange-200",
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function ViewDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [destination, setDestination] = useState<DestinationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/destinations/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setDestination(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            router.push("/admin/destinations");
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
                <div className="grid gap-5 sm:grid-cols-2 mb-5">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <Skeleton className="aspect-video w-full rounded-xl" />
                </div>
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        );
    }

    if (notFound || !destination) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Destination not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/destinations">Back to list</Link>
                </Button>
            </div>
        );
    }

    const banner = destination.images.find((i) => i.type === "banner");
    const cover = destination.images.find((i) => i.type === "cover");

    const bestTime =
        destination.bestTimeStartMonth && destination.bestTimeEndMonth
            ? `${MONTHS_SHORT[destination.bestTimeStartMonth - 1]} – ${MONTHS_SHORT[destination.bestTimeEndMonth - 1]}`
            : null;

    return (
        <div>
            <AdminPageHeader
                title={destination.name}
                subtitle={destination.slug}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/destinations">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/admin/destinations/${id}/edit`}>
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

            {/* Type + status badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={TYPE_STYLES[destination.type]}>
                    {destination.type}
                </Badge>
                {destination.isActive ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                ) : (
                    <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Inactive</Badge>
                )}
                {destination.parent && (
                    <Link
                        href={`/admin/destinations/${destination.parent.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        {destination.parent.name}
                    </Link>
                )}
            </div>

            {/* Images */}
            {(banner || cover) && (
                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                    {banner && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Banner</p>
                            <div className="overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16/9" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={banner.url} alt="Banner" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    )}
                    {cover && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cover</p>
                            <div className="overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16/9" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={cover.url} alt="Cover" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Details */}
            <div className="mb-5 rounded-xl border border-border bg-white p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold">Details</h3>
                <div className="space-y-3">
                    <InfoRow label="Slug" value={destination.slug} />
                    <InfoRow label="Type" value={destination.type} />
                    {destination.country && <InfoRow label="Country" value={destination.country} />}
                    {destination.state && <InfoRow label="State" value={destination.state} />}
                    {bestTime && <InfoRow label="Best Time to Visit" value={bestTime} />}
                    {destination.bestTimeNote && <InfoRow label="Best Time Note" value={destination.bestTimeNote} />}
                    {destination.avgBudgetPerDay && (
                        <InfoRow label="Avg Budget / Day" value={`₹${destination.avgBudgetPerDay.toLocaleString("en-IN")}`} />
                    )}
                </div>
            </div>

            {/* Description */}
            {(destination.shortDescription || destination.description) && (
                <div className="mb-5 rounded-xl border border-border bg-white p-5 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold">Description</h3>
                    {destination.shortDescription && (
                        <div className="mb-4">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Short</p>
                            <p className="text-sm leading-relaxed">{destination.shortDescription}</p>
                        </div>
                    )}
                    {destination.shortDescription && destination.description && <Separator className="my-4" />}
                    {destination.description && (
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Full</p>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{destination.description}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Children */}
            {destination.children.length > 0 && (
                <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold">
                        Child Destinations
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                            {destination.children.length}
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {destination.children.map((child) => (
                            <Link key={child.id} href={`/admin/destinations/${child.id}`}>
                                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                                    {child.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete destination"
                description={`Delete "${destination.name}"? This cannot be undone. Destinations with child entries cannot be deleted.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
