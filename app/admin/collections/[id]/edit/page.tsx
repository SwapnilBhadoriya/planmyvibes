"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useDragReorder } from "@/hooks/use-drag-reorder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, X, Search, GripVertical } from "lucide-react";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { type CollectionDetail, type CollectionPlace } from "../../components/collection-columns";
import { TagInput, syncTags } from "@/components/admin/tag-input";

const formSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">{title}</h3>
            {children}
        </div>
    );
}

interface SearchPlace {
    id: string;
    name: string;
    type: string | null;
    cover: { url: string } | null;
}

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitIntent, setSubmitIntent] = useState<"DRAFT" | "PUBLISHED" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pendingStatusRef = useRef<"DRAFT" | "PUBLISHED">("DRAFT");
    const [coverImage, setCoverImage] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    // Places state — ordered list
    const [places, setPlaces] = useState<CollectionPlace[]>([]);
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    // Place search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchPlace[]>([]);
    const [searching, setSearching] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { register, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        fetch(`/api/collections/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                const c: CollectionDetail = json.data;
                setCollection(c);
                setPlaces(c.places);
                setCoverImage(c.coverImage ?? "");
                reset({
                    title: c.title ?? "",
                    description: c.description ?? "",
                    type: c.type ?? "",
                });
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id, reset]);

    const searchPlaces = useCallback((q: string) => {
        if (!q.trim()) { setSearchResults([]); return; }
        setSearching(true);
        fetch(`/api/places?search=${encodeURIComponent(q)}&limit=10`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setSearchResults(json.data ?? []);
            })
            .catch(() => {})
            .finally(() => setSearching(false));
    }, []);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => searchPlaces(searchQuery), 300);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchQuery, searchPlaces]);

    function addPlace(place: SearchPlace) {
        if (places.some((p) => p.id === place.id)) return;
        const newPlace: CollectionPlace = {
            id: place.id,
            name: place.name,
            type: place.type,
            position: places.length + 1,
            cover: place.cover,
        };
        setPlaces((prev) => [...prev, newPlace]);
        setAddedIds((prev) => new Set(prev).add(place.id));
        setRemovedIds((prev) => { const s = new Set(prev); s.delete(place.id); return s; });
        setSearchQuery("");
        setSearchResults([]);
    }

    function removePlace(placeId: string) {
        setPlaces((prev) => prev.filter((p) => p.id !== placeId));
        if (!addedIds.has(placeId)) {
            setRemovedIds((prev) => new Set(prev).add(placeId));
        }
        setAddedIds((prev) => { const s = new Set(prev); s.delete(placeId); return s; });
    }

    const drag = useDragReorder(places, setPlaces);

    async function onFormSubmit(values: FormValues) {
        const status = pendingStatusRef.current;
        setIsSubmitting(true);
        setError(null);
        try {
            const body: Record<string, unknown> = {};
            if (values.title !== undefined) body.title = values.title || null;
            if (values.description !== undefined) body.description = values.description || null;
            if (values.type !== undefined) body.type = values.type || null;
            body.coverImage = coverImage || null;
            body.status = status;

            if (removedIds.size) body.removePlaceIds = [...removedIds];
            if (addedIds.size) body.addPlaceIds = [...addedIds];

            // Always send ordered place ids so positions are updated
            body.orderedPlaceIds = places.map((p) => p.id);

            const res = await fetch(`/api/collections/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update collection");
            await syncTags("COLLECTION", id, tags);
            router.push(`/admin/collections/${id}`);
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
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-9 w-20" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
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

    const existingIds = new Set(places.map((p) => p.id));

    return (
        <div>
            <AdminPageHeader
                title={`Edit: ${collection.title ?? "Untitled Collection"}`}
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/collections/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

                <Section title="Basic Information">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="col-title">Title</Label>
                            <Input id="col-title" className="mt-1.5" placeholder="e.g. Top 10 places in Ahmedabad" {...register("title")} />
                        </div>
                        <div>
                            <Label htmlFor="col-type">Type</Label>
                            <Input id="col-type" className="mt-1.5" placeholder="e.g. Top Rated, Hidden Gems" {...register("type")} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="col-desc">Description</Label>
                            <Textarea id="col-desc" className="mt-1.5" rows={3} placeholder="Describe this collection" {...register("description")} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label className="mb-1.5 block text-sm font-medium">Tags</Label>
                            <TagInput entityType="COLLECTION" entityId={id} value={tags} onChange={setTags} />
                        </div>
                        <div className="sm:col-span-2">
                            <CoverImageField value={coverImage} onChange={setCoverImage} />
                        </div>
                    </div>
                </Section>

                <Section title={`Places (${places.length})`}>
                    {/* Search to add */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search places to add..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {(searchResults.length > 0 || searching) && (
                            <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-border bg-white shadow-lg">
                                {searching && (
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Searching...
                                    </div>
                                )}
                                {searchResults.map((place) => {
                                    const already = existingIds.has(place.id);
                                    return (
                                        <button
                                            key={place.id}
                                            type="button"
                                            disabled={already}
                                            onClick={() => addPlace(place)}
                                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {place.cover ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={place.cover.url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                                            ) : (
                                                <div className="h-8 w-8 rounded bg-muted shrink-0" />
                                            )}
                                            <span className="flex-1 font-medium">{place.name}</span>
                                            {place.type && <span className="text-xs text-muted-foreground">{place.type}</span>}
                                            {already && <span className="text-xs text-muted-foreground">Added</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Ordered place list */}
                    {places.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">No places yet. Search above to add some.</p>
                    ) : (
                        <ul className="space-y-2">
                            {places.map((place, idx) => (
                                <li
                                    key={place.id}
                                    draggable
                                    onDragStart={() => drag.onDragStart(idx)}
                                    onDragEnter={() => drag.onDragEnter(idx)}
                                    onDragOver={drag.onDragOver}
                                    onDrop={drag.onDrop}
                                    onDragEnd={drag.onDragEnd}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 cursor-grab active:cursor-grabbing"
                                >
                                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                                        {idx + 1}
                                    </span>
                                    {place.cover ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={place.cover.url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                                    ) : (
                                        <div className="h-8 w-8 rounded bg-muted shrink-0" />
                                    )}
                                    <span className="flex-1 text-sm font-medium">{place.name}</span>
                                    {place.type && (
                                        <span className="text-xs text-muted-foreground">{place.type}</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removePlace(place.id)}
                                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/admin/collections/${id}`}>Cancel</Link>
                    </Button>
                    {collection?.status !== "PUBLISHED" && (
                        <Button type="submit" variant="outline" disabled={isSubmitting} onClick={() => { pendingStatusRef.current = "DRAFT"; setSubmitIntent("DRAFT"); }}>
                            {isSubmitting && submitIntent === "DRAFT" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save as Draft
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting} onClick={() => { pendingStatusRef.current = "PUBLISHED"; setSubmitIntent("PUBLISHED"); }}>
                        {isSubmitting && submitIntent === "PUBLISHED" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save & Publish
                    </Button>
                </div>
            </form>
        </div>
    );
}
