"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Upload, X, Loader2, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DestinationCombobox } from "./destination-combobox";
import { type PlaceDetail, type PlaceImage } from "./place-columns";

// ── Schema ─────────────────────────────────────────────────────────────────────
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    destinationId: z.string().min(1, "Destination is required"),
    type: z.string().optional(),
    description: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    durationMinutes: z.string().optional(),
    rating: z.string().optional(),
    address: z.string().optional(),
    googleMapsLink: z.string()
        .refine((v) => !v || /^https?:\/\//.test(v), "Must start with http:// or https://")
        .optional(),
});

type FormValues = z.infer<typeof formSchema>;

enum PlaceType {
    Restaurant = "Restaurant",
    Hotel = "Hotel",
    Attraction = "Attraction",
    Park = "Park",
}

const CUSTOM_VALUE = "__custom__";

interface CoverState { file: File | null; preview: string | null; }
interface NewGalleryItem { file: File; preview: string; }

interface PlaceFormProps {
    initialData?: PlaceDetail;
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    cancelHref?: string;
}

// ── Section wrapper ────────────────────────────────────────────────────────────
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

// ── Single image upload ────────────────────────────────────────────────────────
function CoverUpload({ value, onChange, required, error }: {
    value: CoverState;
    onChange: (v: CoverState) => void;
    required?: boolean;
    error?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (value.preview?.startsWith("blob:")) URL.revokeObjectURL(value.preview);
        onChange({ file, preview: URL.createObjectURL(file) });
        e.target.value = "";
    }

    return (
        <div className="space-y-1.5">
            <Label>
                Cover Image{required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <div
                onClick={() => !value.preview && inputRef.current?.click()}
                className={cn(
                    "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                    value.preview ? "border-border cursor-default" : "border-border hover:border-primary cursor-pointer bg-muted/30",
                    error && "border-destructive"
                )}
                style={{ aspectRatio: "16/9" }}
            >
                {value.preview ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value.preview} alt="Cover" className="h-full w-full object-cover" />
                        <div className="absolute right-2 top-2 flex gap-1.5">
                            <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80">Replace</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); if (value.preview?.startsWith("blob:")) URL.revokeObjectURL(value.preview); onChange({ file: null, preview: null }); }} className="rounded-md bg-black/60 p-1 text-white hover:bg-black/80"><X className="h-3.5 w-3.5" /></button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-7 w-7 opacity-40" />
                        <span className="text-sm">Click to upload cover image</span>
                        <span className="text-xs opacity-60">PNG, JPG, WebP</span>
                    </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

// ── Gallery upload ─────────────────────────────────────────────────────────────
function GalleryUpload({ existing, onRemoveExisting, newItems, onAddNew, onRemoveNew }: {
    existing: PlaceImage[];
    onRemoveExisting: (id: number) => void;
    newItems: NewGalleryItem[];
    onAddNew: (items: NewGalleryItem[]) => void;
    onRemoveNew: (index: number) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFiles(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        const items: NewGalleryItem[] = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        onAddNew(items);
        e.target.value = "";
    }

    const totalCount = existing.length + newItems.length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Gallery Images <span className="ml-1 text-xs text-muted-foreground">({totalCount} photo{totalCount !== 1 ? "s" : ""})</span></Label>
                <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="h-8 gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add Photos
                </Button>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </div>

            {totalCount === 0 ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground hover:border-primary transition-colors"
                >
                    <ImageIcon className="h-8 w-8 opacity-30" />
                    <span className="text-sm">Click to add gallery photos</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {/* Existing images */}
                    {existing.map((img) => (
                        <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(img.id)}
                                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">saved</span>
                        </div>
                    ))}
                    {/* New (pending upload) images */}
                    {newItems.map((item, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.preview} alt="" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemoveNew(i)}
                                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-amber-500/80 px-1.5 py-0.5 text-[10px] text-white">new</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main Form ──────────────────────────────────────────────────────────────────
export function PlaceForm({ initialData, onSubmit, isSubmitting, cancelHref = "/admin/places" }: PlaceFormProps) {
    const isEdit = !!initialData;

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            destinationId: initialData?.destinationId ?? "",
            type: initialData?.type ?? "",
            description: initialData?.description ?? "",
            priceMin: initialData?.priceMin?.toString() ?? "",
            priceMax: initialData?.priceMax?.toString() ?? "",
            durationMinutes: initialData?.durationMinutes?.toString() ?? "",
            rating: initialData?.rating?.toString() ?? "",
            address: initialData?.address ?? "",
            googleMapsLink: initialData?.googleMapsLink ?? "",
        },
    });

    const initialType = initialData?.type ?? "";
    const isKnownType = Object.values(PlaceType).includes(initialType as PlaceType);
    const [selectValue, setSelectValue] = useState(
        initialType === "" ? "" : isKnownType ? initialType : CUSTOM_VALUE
    );
    const [customType, setCustomType] = useState(isKnownType ? "" : initialType);

    useEffect(() => {
        const resolved = selectValue === CUSTOM_VALUE ? customType : selectValue;
        setValue("type", resolved || undefined);
    }, [selectValue, customType, setValue]);

    const [cover, setCover] = useState<CoverState>({
        file: null,
        preview: initialData?.cover?.url ?? null,
    });
    const [coverError, setCoverError] = useState<string>();

    const [existingGallery, setExistingGallery] = useState<PlaceImage[]>(initialData?.gallery ?? []);
    const [removeGalleryIds, setRemoveGalleryIds] = useState<number[]>([]);
    const [newGallery, setNewGallery] = useState<NewGalleryItem[]>([]);

    function handleRemoveExisting(id: number) {
        setExistingGallery((prev) => prev.filter((img) => img.id !== id));
        setRemoveGalleryIds((prev) => [...prev, id]);
    }

    function handleRemoveNew(index: number) {
        setNewGallery((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    }

    async function onFormSubmit(values: FormValues) {
        if (!isEdit && !cover.file) { setCoverError("Cover image is required"); return; }
        setCoverError(undefined);

        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== "") fd.append(k, String(v));
        });
        if (cover.file) fd.append("cover", cover.file);
        newGallery.forEach((item) => fd.append("gallery", item.file));
        if (isEdit && removeGalleryIds.length) {
            fd.append("removeGalleryIds", removeGalleryIds.join(","));
        }

        await onSubmit(fd);
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

            {/* Basic Info */}
            <Section title="Basic Information">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Label htmlFor="place-name">Name <span className="text-destructive">*</span></Label>
                        <Input id="place-name" className="mt-1.5" placeholder="e.g. Taj Mahal" {...register("name")} />
                        <FieldError message={errors.name?.message} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label>Destination <span className="text-destructive">*</span></Label>
                        <div className="mt-1.5">
                            <Controller
                                name="destinationId"
                                control={control}
                                render={({ field }) => (
                                    <DestinationCombobox
                                        value={field.value ?? ""}
                                        onChange={(id) => setValue("destinationId", id, { shouldValidate: true })}
                                        error={errors.destinationId?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="place-type">Type</Label>
                        <Select value={selectValue} onValueChange={setSelectValue}>
                            <SelectTrigger id="place-type" className="mt-1.5">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(PlaceType).map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                                <SelectItem value={CUSTOM_VALUE}>Custom...</SelectItem>
                            </SelectContent>
                        </Select>
                        {selectValue === CUSTOM_VALUE && (
                            <Input
                                className="mt-2"
                                placeholder="Enter custom type"
                                value={customType}
                                onChange={(e) => setCustomType(e.target.value)}
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="place-rating">Rating (0–5)</Label>
                        <Input id="place-rating" type="number" min={0} max={5} step={0.1} className="mt-1.5" placeholder="e.g. 4.5" {...register("rating")} />
                        <FieldError message={errors.rating?.message} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="place-desc">Description</Label>
                        <Textarea id="place-desc" className="mt-1.5" rows={4} placeholder="Describe this place" {...register("description")} />
                    </div>
                </div>
            </Section>

            {/* Pricing & Duration */}
            <Section title="Pricing & Duration">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="price-min">Price Min (₹)</Label>
                        <Input id="price-min" type="number" min={0} className="mt-1.5" placeholder="0" {...register("priceMin")} />
                    </div>
                    <div>
                        <Label htmlFor="price-max">Price Max (₹)</Label>
                        <Input id="price-max" type="number" min={0} className="mt-1.5" placeholder="0" {...register("priceMax")} />
                    </div>
                    <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" min={0} className="mt-1.5" placeholder="e.g. 120" {...register("durationMinutes")} />
                    </div>
                </div>
            </Section>

            {/* Location */}
            <Section title="Location">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" className="mt-1.5" placeholder="Street address" {...register("address")} />
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="maps-link">Google Maps Link</Label>
                        <Input id="maps-link" className="mt-1.5" placeholder="https://maps.google.com/..." {...register("googleMapsLink")} />
                        <FieldError message={errors.googleMapsLink?.message} />
                    </div>
                </div>
            </Section>

            {/* Images */}
            <Section title="Images">
                <div className="space-y-6">
                    <CoverUpload value={cover} onChange={setCover} required={!isEdit} error={coverError} />
                    <GalleryUpload
                        existing={existingGallery}
                        onRemoveExisting={handleRemoveExisting}
                        newItems={newGallery}
                        onAddNew={(items) => setNewGallery((prev) => [...prev, ...items])}
                        onRemoveNew={handleRemoveNew}
                    />
                </div>
                {isEdit && <p className="mt-3 text-xs text-muted-foreground">Cover: upload a new file to replace. Gallery: click × to remove saved images, or add new ones.</p>}
            </Section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "Save changes" : "Create place"}
                </Button>
            </div>
        </form>
    );
}
