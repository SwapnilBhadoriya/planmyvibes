"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { type Blog } from "./blog-columns";

// ── Enum ───────────────────────────────────────────────────────────────────────
enum BlogEntityType {
    Destination = "DESTINATION",
    Place = "PLACE",
    Itinerary = "ITINERARY",
    Collection = "COLLECTION",
    General = "GENERAL",
}

// Entity types that require an entity picker (General does not)
const ENTITY_TYPE_NEEDS_ID = [
    BlogEntityType.Destination,
    BlogEntityType.Place,
    BlogEntityType.Itinerary,
    BlogEntityType.Collection,
];

// ── Schema ─────────────────────────────────────────────────────────────────────
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
    entityType: z.enum(Object.values(BlogEntityType) as [string, ...string[]]),
    entityId: z.string().optional(),
    type: z.string().optional(),
    coverImage: z.string().optional(),
    content: z.string().min(1, "Content is required"),
});

type FormValues = z.infer<typeof formSchema>;

// ── Entity option shape ────────────────────────────────────────────────────────
interface EntityOption { id: string; label: string; }

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugify(str: string) {
    return str.toLowerCase().trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function searchEntities(entityType: BlogEntityType, query: string): Promise<EntityOption[]> {
    const q = query ? `&search=${encodeURIComponent(query)}` : "";
    switch (entityType) {
        case BlogEntityType.Destination: {
            const r = await fetch(`/api/destinations?limit=15${q}`);
            const j = await r.json();
            return (j.data ?? []).map((d: any) => ({ id: d.id, label: d.name }));
        }
        case BlogEntityType.Place: {
            const r = await fetch(`/api/places?limit=15${q}`);
            const j = await r.json();
            return (j.data ?? []).map((p: any) => ({ id: p.id, label: p.name }));
        }
        case BlogEntityType.Itinerary: {
            const r = await fetch(`/api/itineraries?limit=15${q}`);
            const j = await r.json();
            return (j.data ?? []).map((i: any) => ({ id: i.id, label: i.title ?? i.id }));
        }
        case BlogEntityType.Collection: {
            const r = await fetch(`/api/collections?limit=15${q}`);
            const j = await r.json();
            return (j.data ?? []).map((c: any) => ({ id: c.id, label: c.title ?? c.id }));
        }
        default:
            return [];
    }
}

// ── EntityCombobox ─────────────────────────────────────────────────────────────
interface EntityComboboxProps {
    value: string;
    onChange: (id: string) => void;
    options: EntityOption[];
    loading: boolean;
    search: string;
    onSearchChange: (q: string) => void;
    placeholder: string;
    selectedLabel?: string;
}

function EntityCombobox({ value, onChange, options, loading, search, onSearchChange, placeholder, selectedLabel }: EntityComboboxProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    function handleSelect(id: string) { onChange(id); setOpen(false); }

    return (
        <div ref={containerRef} className="relative mt-1.5">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={cn(
                    "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
                    "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring",
                    open && "ring-1 ring-ring"
                )}
            >
                <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
                    {selectedLabel ?? placeholder}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                    {value && (
                        <span role="button" onClick={(e) => { e.stopPropagation(); onChange(""); }}
                            className="rounded p-0.5 hover:bg-destructive/10 hover:text-destructive">
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                </span>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-md">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search…"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
                    </div>
                    <ul className="max-h-52 overflow-y-auto p-1">
                        {!loading && options.length === 0 ? (
                            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                                {search ? "No results match" : "Nothing found"}
                            </li>
                        ) : options.map((opt) => (
                            <li key={opt.id} onClick={() => handleSelect(opt.id)}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                                    opt.id === value && "bg-accent/60"
                                )}
                            >
                                <Check className={cn("h-4 w-4 shrink-0", opt.id === value ? "opacity-100" : "opacity-0")} />
                                <span className="truncate">{opt.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
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

// ── Main form ──────────────────────────────────────────────────────────────────
interface BlogFormProps {
    initialData?: Blog;
    onSubmit: (values: FormValues, status: "DRAFT" | "PUBLISHED") => Promise<void>;
    isSubmitting: boolean;
    submitIntent?: "DRAFT" | "PUBLISHED" | null;
    cancelHref?: string;
}

export function BlogForm({ initialData, onSubmit, isSubmitting, cancelHref = "/admin/blogs" }: BlogFormProps) {
    const isEdit = !!initialData;
    const [pendingStatus, setPendingStatus] = useState<"DRAFT" | "PUBLISHED" | null>(null);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            slug: initialData?.slug ?? "",
            entityType: (initialData?.entityType as BlogEntityType) ?? undefined,
            entityId: initialData?.entityId ?? "",
            type: initialData?.type ?? "",
            coverImage: initialData?.coverImage ?? "",
            content: initialData?.content ?? "",
        },
    });

    const coverImage = watch("coverImage");
    const title = watch("title");
    const entityType = watch("entityType");

    const blogEntityType = entityType as BlogEntityType | undefined;
    const needsEntityId = blogEntityType && ENTITY_TYPE_NEEDS_ID.includes(blogEntityType);

    const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
    const [loadingEntities, setLoadingEntities] = useState(false);
    const [entitySearch, setEntitySearch] = useState("");
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset + initial load when entityType changes
    useEffect(() => {
        setEntitySearch("");
        setEntityOptions([]);
        setValue("entityId", "");
        if (!needsEntityId) return;
        setLoadingEntities(true);
        searchEntities(blogEntityType!, "")
            .then(setEntityOptions)
            .catch(() => setEntityOptions([]))
            .finally(() => setLoadingEntities(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType]);

    // Debounced search when user types
    useEffect(() => {
        if (!needsEntityId) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setLoadingEntities(true);
            searchEntities(blogEntityType!, entitySearch)
                .then(setEntityOptions)
                .catch(() => setEntityOptions([]))
                .finally(() => setLoadingEntities(false));
        }, 300);
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entitySearch]);

    function handleTitleBlur() {
        if (!isEdit && title) {
            setValue("slug", slugify(title), { shouldValidate: true });
        }
    }

    function submitWithStatus(status: "DRAFT" | "PUBLISHED") {
        setPendingStatus(status);
        handleSubmit((values) => onSubmit(values, status))();
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">

            <Section title="Meta">
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Title */}
                    <div className="sm:col-span-2">
                        <Label htmlFor="blog-title">Title <span className="text-destructive">*</span></Label>
                        <Input
                            id="blog-title"
                            className="mt-1.5"
                            placeholder="e.g. Best places to visit in Goa"
                            {...register("title")}
                            onBlur={handleTitleBlur}
                        />
                        <FieldError message={errors.title?.message} />
                    </div>

                    {/* Slug */}
                    <div>
                        <Label htmlFor="blog-slug">Slug <span className="text-destructive">*</span></Label>
                        <Input id="blog-slug" className="mt-1.5 font-mono text-sm" placeholder="best-places-goa" {...register("slug")} />
                        <FieldError message={errors.slug?.message} />
                    </div>

                    {/* Type */}
                    <div>
                        <Label htmlFor="blog-type">Type</Label>
                        <Input id="blog-type" className="mt-1.5" placeholder="e.g. guide, listicle, review" {...register("type")} />
                    </div>

                    {/* Cover Image */}
                    <div className="sm:col-span-2">
                        <CoverImageField
                            value={coverImage ?? ""}
                            onChange={(url) => setValue("coverImage", url)}
                        />
                    </div>

                    {/* Entity Type */}
                    <div>
                        <Label>Entity Type <span className="text-destructive">*</span></Label>
                        <Controller
                            name="entityType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? ""}
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue("entityId", "");
                                    }}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select entity type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(BlogEntityType).map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t.charAt(0) + t.slice(1).toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError message={errors.entityType?.message} />
                    </div>

                    {/* Entity picker — shown only when a non-General type is selected */}
                    {needsEntityId && (
                        <div>
                            <Label>
                                {entityType.charAt(0) + entityType.slice(1).toLowerCase()}
                                <span className="ml-1 text-destructive">*</span>
                            </Label>
                            <Controller
                                name="entityId"
                                control={control}
                                render={({ field }) => {
                                    const selected = entityOptions.find((o) => o.id === field.value);
                                    return (
                                        <EntityCombobox
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            options={entityOptions}
                                            loading={loadingEntities}
                                            search={entitySearch}
                                            onSearchChange={setEntitySearch}
                                            placeholder={`Select ${entityType.toLowerCase()}…`}
                                            selectedLabel={selected?.label}
                                        />
                                    );
                                }}
                            />
                            <FieldError message={errors.entityId?.message} />
                        </div>
                    )}
                </div>
            </Section>

            <Section title="Content">
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Start writing your blog post..."
                        />
                    )}
                />
                <FieldError message={errors.content?.message} />
            </Section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                {initialData?.status !== "PUBLISHED" && (
                    <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => submitWithStatus("DRAFT")}>
                        {isSubmitting && pendingStatus === "DRAFT" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save as Draft
                    </Button>
                )}
                <Button type="button" disabled={isSubmitting} onClick={() => submitWithStatus("PUBLISHED")}>
                    {isSubmitting && pendingStatus === "PUBLISHED" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "Save & Publish" : "Publish"}
                </Button>
            </div>
        </form>
    );
}

export type { FormValues as BlogFormValues };
