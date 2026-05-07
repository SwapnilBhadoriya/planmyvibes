"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDragReorder } from "@/hooks/use-drag-reorder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, X, Search, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DestinationCombobox } from "../../places/components/destination-combobox";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.string().optional(),
    destinationId: z.string().min(1, "Destination is required"),
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

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

interface SearchPlace {
    id: string;
    name: string;
    type: string | null;
    cover: { url: string } | null;
}

interface SelectedPlace extends SearchPlace {
    position: number;
}

export default function NewCollectionPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placesError, setPlacesError] = useState<string | null>(null);

    const [places, setPlaces] = useState<SelectedPlace[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchPlace[]>([]);
    const [searching, setSearching] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", description: "", type: "", destinationId: "" },
    });

    const destinationId = watch("destinationId");

    const searchPlaces = useCallback((q: string) => {
        if (!q.trim()) { setSearchResults([]); return; }
        setSearching(true);
        const destParam = destinationId ? `&destinationId=${destinationId}` : "";
        fetch(`/api/places?search=${encodeURIComponent(q)}&limit=10${destParam}`)
            .then((r) => r.json())
            .then((json) => { if (json.success) setSearchResults(json.data ?? []); })
            .catch(() => {})
            .finally(() => setSearching(false));
    }, [destinationId]);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => searchPlaces(searchQuery), 300);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchQuery, searchPlaces]);

    function addPlace(place: SearchPlace) {
        if (places.some((p) => p.id === place.id)) return;
        setPlaces((prev) => [...prev, { ...place, position: prev.length + 1 }]);
        setPlacesError(null);
        setSearchQuery("");
        setSearchResults([]);
    }

    function removePlace(placeId: string) {
        setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    }

    const drag = useDragReorder(places, setPlaces);

    async function onFormSubmit(values: FormValues) {
        if (places.length === 0) {
            setPlacesError("Add at least one place to the collection");
            return;
        }
        setPlacesError(null);
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/collections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description || undefined,
                    type: values.type || undefined,
                    destinationId: values.destinationId,
                    placeIds: places.map((p) => p.id),
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create collection");
            router.push("/admin/collections");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const existingIds = new Set(places.map((p) => p.id));

    return (
        <div>
            <AdminPageHeader
                title="New Collection"
                subtitle="Create a curated list of places"
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/collections">
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
                            <Label htmlFor="col-title">Title <span className="text-destructive">*</span></Label>
                            <Input id="col-title" className="mt-1.5" placeholder="e.g. Top 10 places in Ahmedabad" {...register("title")} />
                            <FieldError message={errors.title?.message} />
                        </div>
                        <div>
                            <Label htmlFor="col-type">Type</Label>
                            <Input id="col-type" className="mt-1.5" placeholder="e.g. Top Rated, Hidden Gems" {...register("type")} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label>Destination <span className="text-destructive">*</span></Label>
                            <div className="mt-1.5">
                                <DestinationCombobox
                                    value={destinationId}
                                    onChange={(val) => setValue("destinationId", val, { shouldValidate: true })}
                                    error={errors.destinationId?.message}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="col-desc">Description</Label>
                            <Textarea id="col-desc" className="mt-1.5" rows={3} placeholder="Describe this collection" {...register("description")} />
                        </div>
                    </div>
                </Section>

                <Section title={`Places (${places.length})`}>
                    {placesError && (
                        <p className="mb-3 text-xs text-destructive">{placesError}</p>
                    )}
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
                                    {place.type && <span className="text-xs text-muted-foreground">{place.type}</span>}
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
                        <Link href="/admin/collections">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create collection
                    </Button>
                </div>
            </form>
        </div>
    );
}
