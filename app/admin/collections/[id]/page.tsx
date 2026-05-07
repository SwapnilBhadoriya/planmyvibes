"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { type CollectionDetail } from "../components/collection-columns";

export default function ViewCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/collections/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setCollection(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            router.push("/admin/collections");
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
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-9 w-40" />
                </div>
                <Skeleton className="mb-5 h-24 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (notFound || !collection) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Collection not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/collections">Back to list</Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title={collection.title ?? "Untitled Collection"}
                subtitle={collection.destination?.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/collections">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/admin/collections/${id}/edit`}>
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

            {/* Meta badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                {collection.type && (
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        {collection.type}
                    </Badge>
                )}
                {collection.destination && (
                    <Link
                        href={`/admin/destinations/${collection.destination.id}`}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                        <MapPin className="h-3.5 w-3.5" />
                        {collection.destination.name}
                    </Link>
                )}
                <span className="text-sm text-muted-foreground">
                    {collection.places.length} place{collection.places.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Description */}
            {collection.description && (
                <div className="mb-5 rounded-xl border border-border bg-white p-5 sm:p-6">
                    <h3 className="mb-2 text-sm font-semibold">Description</h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
                </div>
            )}

            {/* Places grid */}
            {collection.places.length > 0 && (
                <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold">
                        Places
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                            {collection.places.length}
                        </span>
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {collection.places.map((place, idx) => (
                            <Link
                                key={place.id}
                                href={`/admin/places/${place.id}`}
                                className="group relative overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
                            >
                                {/* Cover image */}
                                <div className="relative aspect-[4/3] bg-muted">
                                    {place.cover ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={place.cover.url} alt={place.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground/30 text-4xl font-bold">
                                            {idx + 1}
                                        </div>
                                    )}
                                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[11px] font-semibold text-white">
                                        {idx + 1}
                                    </span>
                                </div>
                                {/* Info */}
                                <div className="p-3">
                                    <p className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">{place.name}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        {place.type && (
                                            <span className="text-xs text-muted-foreground">{place.type}</span>
                                        )}
                                        {place.rating && (
                                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                {Number(place.rating).toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete collection"
                description={`Delete "${collection.title ?? "this collection"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
