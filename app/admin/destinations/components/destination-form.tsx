"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/lib/constants";
import { type DestinationDetail } from "./destination-columns";
import { TagInput } from "@/components/admin/tag-input";

// ── Schema ─────────────────────────────────────────────────────────────────────
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    type: z.enum(["country", "state", "city"]),
    parentId: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    shortDescription: z.string().max(255, "Max 255 characters").optional(),
    description: z.string().optional(),
    bestTimeStartMonth: z.string().optional(),
    bestTimeEndMonth: z.string().optional(),
    bestTimeNote: z.string().optional(),
    avgBudgetPerDay: z.string().optional(),
    isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParentOption { id: string; name: string; country?: string | null; }
interface ImageState { file: File | null; preview: string | null; }

interface DestinationFormProps {
    initialData?: DestinationDetail;
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    cancelHref?: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

function toSlug(text: string) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ── Image upload field ─────────────────────────────────────────────────────────
function ImageUploadField({
    label, value, onChange, required, error,
}: {
    label: string;
    value: ImageState;
    onChange: (v: ImageState) => void;
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

    function handleRemove(e: React.MouseEvent) {
        e.stopPropagation();
        if (value.preview?.startsWith("blob:")) URL.revokeObjectURL(value.preview);
        onChange({ file: null, preview: null });
    }

    return (
        <div className="space-y-1.5">
            <Label>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <div
                onClick={() => !value.preview && inputRef.current?.click()}
                className={cn(
                    "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                    value.preview
                        ? "border-border cursor-default"
                        : "border-border hover:border-primary cursor-pointer bg-muted/30",
                    error && "border-destructive"
                )}
                style={{ aspectRatio: "16/9" }}
            >
                {value.preview ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value.preview} alt={label} className="h-full w-full object-cover" />
                        <div className="absolute right-2 top-2 flex gap-1.5">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                            >
                                Replace
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="rounded-md bg-black/60 p-1 text-white hover:bg-black/80"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-7 w-7 opacity-40" />
                        <span className="text-sm">Click to upload {label}</span>
                        <span className="text-xs opacity-60">PNG, JPG, WebP</span>
                    </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
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

// ── Main Form ──────────────────────────────────────────────────────────────────
export function DestinationForm({
    initialData,
    onSubmit,
    isSubmitting,
    cancelHref = "/admin/destinations",
    tags,
    onTagsChange,
}: DestinationFormProps) {
    const isEdit = !!initialData;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            slug: initialData?.slug ?? "",
            type: initialData?.type ?? "country",
            parentId: initialData?.parentId ?? "",
            country: initialData?.country ?? "",
            state: initialData?.state ?? "",
            shortDescription: initialData?.shortDescription ?? "",
            description: initialData?.description ?? "",
            bestTimeStartMonth: initialData?.bestTimeStartMonth?.toString() ?? "",
            bestTimeEndMonth: initialData?.bestTimeEndMonth?.toString() ?? "",
            bestTimeNote: initialData?.bestTimeNote ?? "",
            avgBudgetPerDay: initialData?.avgBudgetPerDay?.toString() ?? "",
            isActive: initialData?.isActive ?? true,
        },
    });

    const watchedType = watch("type");
    const watchedName = watch("name");
    const watchedShortDesc = watch("shortDescription") ?? "";

    const [slugManual, setSlugManual] = useState(isEdit);
    const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
    const [loadingParents, setLoadingParents] = useState(false);

    const [banner, setBanner] = useState<ImageState>({
        file: null,
        preview: initialData?.images.find((i) => i.type === "banner")?.url ?? null,
    });
    const [cover, setCover] = useState<ImageState>({
        file: null,
        preview: initialData?.images.find((i) => i.type === "cover")?.url ?? null,
    });
    const [imageErrors, setImageErrors] = useState<{ banner?: string; cover?: string }>({});

    // Auto-slug from name
    useEffect(() => {
        if (!slugManual) setValue("slug", toSlug(watchedName));
    }, [watchedName, slugManual, setValue]);

    // Load parent options when type changes
    useEffect(() => {
        if (watchedType === "country") { setParentOptions([]); return; }
        const parentType = watchedType === "state" ? "country" : "state";
        setLoadingParents(true);
        fetch(`/api/destinations?type=${parentType}&limit=100`)
            .then((r) => r.json())
            .then((json) => { if (json.success) setParentOptions(json.data ?? []); })
            .finally(() => setLoadingParents(false));
    }, [watchedType]);

    function handleParentChange(id: string) {
        setValue("parentId", id);
        const parent = parentOptions.find((p) => p.id === id);
        if (!parent) return;
        if (watchedType === "state") {
            setValue("country", parent.name);
        } else if (watchedType === "city") {
            setValue("state", parent.name);
            setValue("country", parent.country ?? "");
        }
    }

    async function onFormSubmit(values: FormValues) {
        // Validate images for create
        const imgErrs: typeof imageErrors = {};
        if (!isEdit && !banner.file) imgErrs.banner = "Banner image is required";
        if (!isEdit && !cover.file) imgErrs.cover = "Cover image is required";
        if (imgErrs.banner || imgErrs.cover) { setImageErrors(imgErrs); return; }
        setImageErrors({});

        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== "") fd.append(k, String(v));
        });
        if (banner.file) fd.append("banner", banner.file);
        if (cover.file) fd.append("cover", cover.file);

        await onSubmit(fd);
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

            {/* Basic Information */}
            <Section title="Basic Information">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="dest-name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="dest-name"
                            className="mt-1.5"
                            placeholder="e.g. Goa"
                            {...register("name")}
                        />
                        <FieldError message={errors.name?.message} />
                    </div>

                    <div>
                        <Label htmlFor="dest-slug">Slug <span className="text-destructive">*</span></Label>
                        <Input
                            id="dest-slug"
                            className="mt-1.5"
                            placeholder="e.g. goa"
                            {...register("slug", {
                                onChange: () => setSlugManual(true),
                            })}
                        />
                        <FieldError message={errors.slug?.message} />
                    </div>

                    <div>
                        <Label htmlFor="dest-type">Type <span className="text-destructive">*</span></Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(v) => {
                                        field.onChange(v);
                                        setValue("parentId", "");
                                        setValue("country", "");
                                        setValue("state", "");
                                    }}
                                >
                                    <SelectTrigger id="dest-type" className="mt-1.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="country">Country</SelectItem>
                                        <SelectItem value="state">State / Province</SelectItem>
                                        <SelectItem value="city">City / Town</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError message={errors.type?.message} />
                    </div>

                    <div className="flex items-end pb-1">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <label className="flex cursor-pointer items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(v) => field.onChange(!!v)}
                                    />
                                    Active (visible to users)
                                </label>
                            )}
                        />
                    </div>
                </div>
            </Section>

            {/* Location (conditional) */}
            {watchedType !== "country" && (
                <Section title="Location">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="dest-parent">
                                {watchedType === "state" ? "Parent Country" : "Parent State"}
                            </Label>
                            <Controller
                                name="parentId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={handleParentChange}
                                        disabled={loadingParents}
                                    >
                                        <SelectTrigger id="dest-parent" className="mt-1.5">
                                            <SelectValue placeholder={loadingParents ? "Loading…" : "Select…"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parentOptions.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="dest-country">Country</Label>
                            <Input
                                id="dest-country"
                                className="mt-1.5"
                                placeholder="Auto-filled from parent"
                                {...register("country")}
                            />
                        </div>

                        {watchedType === "city" && (
                            <div>
                                <Label htmlFor="dest-state">State / Province</Label>
                                <Input
                                    id="dest-state"
                                    className="mt-1.5"
                                    placeholder="Auto-filled from parent"
                                    {...register("state")}
                                />
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Description */}
            <Section title="Description">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-baseline justify-between">
                            <Label htmlFor="dest-short">Short Description</Label>
                            <span className="text-xs text-muted-foreground">{watchedShortDesc.length}/255</span>
                        </div>
                        <Textarea
                            id="dest-short"
                            className="mt-1.5"
                            placeholder="Brief summary shown in cards"
                            rows={2}
                            {...register("shortDescription")}
                        />
                        <FieldError message={errors.shortDescription?.message} />
                    </div>
                    <div>
                        <Label htmlFor="dest-desc">Full Description</Label>
                        <Textarea
                            id="dest-desc"
                            className="mt-1.5"
                            placeholder="Detailed description for the destination page"
                            rows={5}
                            {...register("description")}
                        />
                    </div>
                    <div>
                        <Label className="mb-1.5 block">Tags</Label>
                        <TagInput
                            entityType="DESTINATION"
                            entityId={initialData?.id}
                            value={tags}
                            onChange={onTagsChange}
                        />
                    </div>
                </div>
            </Section>

            {/* Travel Info */}
            <Section title="Travel Information">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label>Best Time — Start Month</Label>
                        <Controller
                            name="bestTimeStartMonth"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((m, i) => (
                                            <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div>
                        <Label>Best Time — End Month</Label>
                        <Controller
                            name="bestTimeEndMonth"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((m, i) => (
                                            <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="best-note">Best Time Note</Label>
                        <Input
                            id="best-note"
                            className="mt-1.5"
                            placeholder="e.g. Avoid monsoon (Jun–Sep)"
                            {...register("bestTimeNote")}
                        />
                    </div>

                    <div>
                        <Label htmlFor="avg-budget">Avg Budget / Day (₹)</Label>
                        <Input
                            id="avg-budget"
                            type="number"
                            min={0}
                            className="mt-1.5"
                            placeholder="e.g. 2500"
                            {...register("avgBudgetPerDay")}
                        />
                    </div>
                </div>
            </Section>

            {/* Images */}
            <Section title="Images">
                <div className="grid gap-5 sm:grid-cols-2">
                    <ImageUploadField
                        label="Banner Image"
                        value={banner}
                        onChange={setBanner}
                        required={!isEdit}
                        error={imageErrors.banner}
                    />
                    <ImageUploadField
                        label="Cover Image"
                        value={cover}
                        onChange={setCover}
                        required={!isEdit}
                        error={imageErrors.cover}
                    />
                </div>
                {isEdit && (
                    <p className="mt-3 text-xs text-muted-foreground">
                        Leave blank to keep existing images. Upload a new file to replace.
                    </p>
                )}
            </Section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "Save changes" : "Create destination"}
                </Button>
            </div>
        </form>
    );
}
