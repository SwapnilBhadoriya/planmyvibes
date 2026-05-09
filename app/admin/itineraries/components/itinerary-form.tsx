"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
    Plus, Trash2, ChevronDown, ChevronUp, GripVertical,
    Loader2, Search, X, ImagePlus, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DestinationCombobox } from "@/app/admin/places/components/destination-combobox";
import { TagInput } from "@/components/admin/tag-input";
import { TRIP_TYPES, DIFFICULTIES, TRAVEL_MODES, ACTIVITY_TYPES, TRANSPORT_MODES, TIP_TYPES } from "@/lib/constants";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Transport {
    mode?: string;
    provider?: string;
    fromPlaceId?: string;
    fromPlaceName?: string;
    toPlaceId?: string;
    toPlaceName?: string;
    durationMinutes?: number;
    distanceKm?: number;
    cost?: number;
    notes?: string;
}

export interface ActivityTip {
    _key: string;
    type?: string;
    content: string;
}

export interface ActivityItem {
    _key: string;
    title?: string;
    activityType?: string;
    startTime?: string;
    durationMinutes?: number;
    notes?: string;
    isOptional: boolean;
    placeIds: string[];
    placeNames: Record<string, string>;
    transports: Transport[];
    tips: ActivityTip[];
}

export interface DayItem {
    _key: string;
    dayNumber: number;
    title?: string;
    coverImageUrl?: string;
    destinationId?: string;
    destinationName?: string;
    activities: ActivityItem[];
}

export interface ItineraryFormValues {
    title?: string;
    subtitle?: string;
    description?: string;
    durationDays?: number;
    budgetMin?: number;
    budgetMax?: number;
    currency?: string;
    tripType?: string;
    difficulty?: string;
    travelMode?: string;
    stayNights?: number;
    minPeople?: number;
    maxPeople?: number;
    estimatedBudget?: number;
    destinationIds: { destinationId: string; destinationName: string; position: number }[];
    days: DayItem[];
}

// ── Constants ──────────────────────────────────────────────────────────────────


function makeKey() {
    return Math.random().toString(36).slice(2, 9);
}

function makeActivity(): ActivityItem {
    return {
        _key: makeKey(),
        isOptional: false,
        placeIds: [],
        placeNames: {},
        transports: [],
        tips: [],
    };
}

function makeDay(dayNumber: number): DayItem {
    return { _key: makeKey(), dayNumber, activities: [] };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-xl border border-border bg-white p-5 sm:p-6", className)}>
            <h3 className="mb-4 text-sm font-semibold">{title}</h3>
            {children}
        </div>
    );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}{required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <div className="mt-1.5">{children}</div>
        </div>
    );
}

// Place search combobox
interface PlaceSearchProps {
    destinationId?: string;
    selectedIds: string[];
    selectedNames: Record<string, string>;
    onAdd: (id: string, name: string) => void;
    onRemove: (id: string) => void;
}

function PlaceSearch({ destinationId, selectedIds, selectedNames, onAdd, onRemove }: PlaceSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ id: string; name: string; type: string | null }[]>([]);
    const [loading, setLoading] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((q: string) => {
        if (!q.trim()) { setResults([]); return; }
        setLoading(true);
        const destParam = destinationId ? `&destinationId=${destinationId}` : "";
        fetch(`/api/places?search=${encodeURIComponent(q)}&limit=10${destParam}`)
            .then((r) => r.json())
            .then((json) => { if (json.success) setResults(json.data ?? []); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [destinationId]);

    function handleChange(q: string) {
        setQuery(q);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => search(q), 300);
    }

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedIds.map((id) => (
                        <span key={id} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {selectedNames[id] ?? id}
                            <button type="button" onClick={() => onRemove(id)} className="ml-0.5 text-primary/60 hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="pl-8 text-sm h-8"
                    placeholder="Search places to add…"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {(results.length > 0 || loading) && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-white shadow-lg">
                        {loading && <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />Searching…</div>}
                        {results.map((p) => {
                            const added = selectedIds.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    disabled={added}
                                    onClick={() => { onAdd(p.id, p.name); setQuery(""); setResults([]); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-40 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <span className="flex-1 font-medium">{p.name}</span>
                                    {p.type && <span className="text-xs text-muted-foreground">{p.type}</span>}
                                    {added && <span className="text-xs text-muted-foreground">Added</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// Single transport row
function TransportRow({ transport, index, onChange, onRemove, destinationId }: {
    transport: Transport;
    index: number;
    onChange: (t: Transport) => void;
    onRemove: () => void;
    destinationId?: string;
}) {
    function set(field: keyof Transport, value: any) {
        onChange({ ...transport, [field]: value || undefined });
    }

    return (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Transport {index + 1}</span>
                <button type="button" onClick={onRemove} className="rounded p-0.5 text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <Label className="text-xs text-muted-foreground">Mode</Label>
                    <Select value={transport.mode ?? ""} onValueChange={(v) => set("mode", v)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {TRANSPORT_MODES.map((m) => (
                                <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Provider</Label>
                    <Input className="mt-1 h-8 text-sm" placeholder="e.g. Ola, IRCTC" value={transport.provider ?? ""} onChange={(e) => set("provider", e.target.value)} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Duration (min)</Label>
                    <Input className="mt-1 h-8 text-sm" type="number" placeholder="60" value={transport.durationMinutes ?? ""} onChange={(e) => set("durationMinutes", e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Distance (km)</Label>
                    <Input className="mt-1 h-8 text-sm" type="number" placeholder="10.5" value={transport.distanceKm ?? ""} onChange={(e) => set("distanceKm", e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Cost (₹)</Label>
                    <Input className="mt-1 h-8 text-sm" type="number" placeholder="200" value={transport.cost ?? ""} onChange={(e) => set("cost", e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <Input className="mt-1 h-8 text-sm" placeholder="Optional notes" value={transport.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
                </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
                <div>
                    <Label className="text-xs text-muted-foreground">From place</Label>
                    <div className="mt-1">
                        <PlaceSearch
                            destinationId={destinationId}
                            selectedIds={transport.fromPlaceId ? [transport.fromPlaceId] : []}
                            selectedNames={transport.fromPlaceId && transport.fromPlaceName ? { [transport.fromPlaceId]: transport.fromPlaceName } : {}}
                            onAdd={(id, name) => onChange({ ...transport, fromPlaceId: id, fromPlaceName: name })}
                            onRemove={() => onChange({ ...transport, fromPlaceId: undefined, fromPlaceName: undefined })}
                        />
                    </div>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">To place</Label>
                    <div className="mt-1">
                        <PlaceSearch
                            destinationId={destinationId}
                            selectedIds={transport.toPlaceId ? [transport.toPlaceId] : []}
                            selectedNames={transport.toPlaceId && transport.toPlaceName ? { [transport.toPlaceId]: transport.toPlaceName } : {}}
                            onAdd={(id, name) => onChange({ ...transport, toPlaceId: id, toPlaceName: name })}
                            onRemove={() => onChange({ ...transport, toPlaceId: undefined, toPlaceName: undefined })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Activity editor
function ActivityEditor({ activity, index, dayDestinationId, onChange, onRemove }: {
    activity: ActivityItem;
    index: number;
    dayDestinationId?: string;
    onChange: (a: ActivityItem) => void;
    onRemove: () => void;
}) {
    const [open, setOpen] = useState(true);

    function set(field: keyof ActivityItem, value: any) {
        onChange({ ...activity, [field]: value });
    }

    function updateTransport(i: number, t: Transport) {
        const next = [...activity.transports];
        next[i] = t;
        set("transports", next);
    }
    function removeTransport(i: number) {
        set("transports", activity.transports.filter((_, idx) => idx !== i));
    }
    function addTransport() {
        set("transports", [...activity.transports, {}]);
    }

    function updateTip(i: number, tip: ActivityTip) {
        const next = [...activity.tips];
        next[i] = tip;
        set("tips", next);
    }
    function removeTip(i: number) {
        set("tips", activity.tips.filter((_, idx) => idx !== i));
    }
    function addTip() {
        set("tips", [...activity.tips, { _key: makeKey(), content: "", type: undefined }]);
    }

    return (
        <div className="rounded-lg border border-border bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                </span>
                <span className="flex-1 truncate text-sm font-medium">
                    {activity.title || <span className="italic text-muted-foreground">Activity {index + 1}</span>}
                </span>
                {activity.activityType && (
                    <Badge variant="outline" className="text-xs shrink-0">{activity.activityType}</Badge>
                )}
                <button type="button" onClick={() => setOpen((p) => !p)} className="shrink-0 text-muted-foreground hover:text-foreground">
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button type="button" onClick={onRemove} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                </button>
            </div>

            {open && (
                <div className="p-3 space-y-4">
                    {/* Basic fields */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label className="text-xs text-muted-foreground">Title</Label>
                            <Input className="mt-1 h-8 text-sm" placeholder="e.g. Visit Gateway of India" value={activity.title ?? ""} onChange={(e) => set("title", e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Activity Type</Label>
                            <Select value={activity.activityType ?? ""} onValueChange={(v) => set("activityType", v)}>
                                <SelectTrigger className="mt-1 h-8 text-sm">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACTIVITY_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Start Time</Label>
                            <div className="relative mt-1">
                                <Clock className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input className="pl-7 h-8 text-sm" type="time" value={activity.startTime ?? ""} onChange={(e) => set("startTime", e.target.value || undefined)} />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Duration (min)</Label>
                            <Input className="mt-1 h-8 text-sm" type="number" placeholder="60" value={activity.durationMinutes ?? ""} onChange={(e) => set("durationMinutes", e.target.value ? Number(e.target.value) : undefined)} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label className="text-xs text-muted-foreground">Notes</Label>
                            <Textarea className="mt-1 text-sm" rows={2} placeholder="Any notes for this activity" value={activity.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`optional-${activity._key}`}
                                checked={activity.isOptional}
                                onChange={(e) => set("isOptional", e.target.checked)}
                                className="h-3.5 w-3.5"
                            />
                            <Label htmlFor={`optional-${activity._key}`} className="text-xs text-muted-foreground cursor-pointer">Optional activity</Label>
                        </div>
                    </div>

                    {/* Places */}
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Places</Label>
                        <div className="mt-2">
                            <PlaceSearch
                                destinationId={dayDestinationId}
                                selectedIds={activity.placeIds}
                                selectedNames={activity.placeNames}
                                onAdd={(id, name) => {
                                    onChange({ ...activity, placeIds: [...activity.placeIds, id], placeNames: { ...activity.placeNames, [id]: name } });
                                }}
                                onRemove={(id) => {
                                    const names = { ...activity.placeNames };
                                    delete names[id];
                                    onChange({ ...activity, placeIds: activity.placeIds.filter((p) => p !== id), placeNames: names });
                                }}
                            />
                        </div>
                    </div>

                    {/* Transports */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transportation</Label>
                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={addTransport}>
                                <Plus className="mr-1 h-3 w-3" />Add transport
                            </Button>
                        </div>
                        {activity.transports.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No transport added</p>
                        ) : (
                            <div className="space-y-2">
                                {activity.transports.map((t, ti) => (
                                    <TransportRow
                                        key={ti}
                                        transport={t}
                                        index={ti}
                                        onChange={(updated) => updateTransport(ti, updated)}
                                        onRemove={() => removeTransport(ti)}
                                        destinationId={dayDestinationId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tips</Label>
                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={addTip}>
                                <Plus className="mr-1 h-3 w-3" />Add tip
                            </Button>
                        </div>
                        {activity.tips.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No tips added</p>
                        ) : (
                            <div className="space-y-2">
                                {activity.tips.map((tip, ti) => (
                                    <div key={tip._key} className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
                                        <div className="flex-1 grid gap-2 sm:grid-cols-4">
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Type</Label>
                                                <Select value={tip.type ?? ""} onValueChange={(v) => updateTip(ti, { ...tip, type: v || undefined })}>
                                                    <SelectTrigger className="mt-1 h-8 text-sm">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TIP_TYPES.map((t) => (
                                                            <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="sm:col-span-3">
                                                <Label className="text-xs text-muted-foreground">Content</Label>
                                                <Textarea
                                                    className="mt-1 text-sm"
                                                    rows={2}
                                                    placeholder="Enter tip content…"
                                                    value={tip.content}
                                                    onChange={(e) => updateTip(ti, { ...tip, content: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeTip(ti)} className="mt-1 rounded p-0.5 text-muted-foreground hover:text-destructive shrink-0">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Day editor
function DayEditor({ day, index, onChange, onRemove }: {
    day: DayItem;
    index: number;
    onChange: (d: DayItem) => void;
    onRemove: () => void;
}) {
    const [open, setOpen] = useState(true);
    const [uploading, setUploading] = useState(false);

    function set(field: keyof DayItem, value: any) {
        onChange({ ...day, [field]: value });
    }

    async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const json = await res.json();
            if (json.success) set("coverImageUrl", json.url);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function addActivity() {
        set("activities", [...day.activities, makeActivity()]);
    }

    function updateActivity(i: number, a: ActivityItem) {
        const next = [...day.activities];
        next[i] = a;
        // Also handle placeNames when adding a place (onAdd receives both)
        set("activities", next);
    }

    function removeActivity(i: number) {
        set("activities", day.activities.filter((_, idx) => idx !== i));
    }

    return (
        <div className="rounded-xl border border-border bg-slate-50">
            {/* Day header */}
            <div className="flex items-center gap-3 rounded-t-xl bg-white border-b border-border px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {day.dayNumber}
                </span>
                <div className="flex-1 grid gap-2 sm:grid-cols-2">
                    <Input
                        className="h-8 text-sm font-medium"
                        placeholder={`Day ${day.dayNumber} title`}
                        value={day.title ?? ""}
                        onChange={(e) => set("title", e.target.value)}
                    />
                    <DestinationCombobox
                        value={day.destinationId ?? ""}
                        onChange={(id, name) => onChange({ ...day, destinationId: id || undefined, destinationName: name || undefined })}
                    />
                </div>
                <button type="button" onClick={() => setOpen((p) => !p)} className="shrink-0 text-muted-foreground hover:text-foreground">
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button type="button" onClick={onRemove} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {open && (
                <div className="p-4 space-y-3">
                    {/* Day cover image */}
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            {day.coverImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={day.coverImageUrl} alt="" className="h-full w-full object-cover" />
                            ) : uploading ? (
                                <div className="flex h-full items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                            ) : (
                                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary">
                                    <ImagePlus className="h-4 w-4" />
                                    <span className="text-[10px]">Cover</span>
                                    <input type="file" accept="image/*" className="sr-only" onChange={handleCoverUpload} />
                                </label>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground">Day Cover Image</Label>
                            <Input
                                className="mt-1 h-8 text-xs font-mono"
                                placeholder="Paste URL or click thumbnail to upload"
                                value={day.coverImageUrl ?? ""}
                                onChange={(e) => set("coverImageUrl", e.target.value || undefined)}
                            />
                        </div>
                        {day.coverImageUrl && (
                            <button type="button" onClick={() => set("coverImageUrl", undefined)} className="shrink-0 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {day.activities.map((a, ai) => (
                        <ActivityEditor
                            key={a._key}
                            activity={a}
                            index={ai}
                            dayDestinationId={day.destinationId}
                            onChange={(updated) => updateActivity(ai, updated)}
                            onRemove={() => removeActivity(ai)}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed"
                        onClick={addActivity}
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Add Activity to Day {day.dayNumber}
                    </Button>
                </div>
            )}
        </div>
    );
}

// ── Main Form ──────────────────────────────────────────────────────────────────

interface ItineraryFormProps {
    initialData?: ItineraryFormValues;
    onSubmit: (values: ItineraryFormValues, status: "DRAFT" | "PUBLISHED") => Promise<void>;
    isSubmitting: boolean;
    submitIntent?: "DRAFT" | "PUBLISHED" | null;
    cancelHref?: string;
    tags?: string[];
    onTagsChange?: (tags: string[]) => void;
    entityId?: string;
    initialStatus?: "DRAFT" | "PUBLISHED";
}

export function ItineraryForm({ initialData, onSubmit, isSubmitting, submitIntent, cancelHref = "/admin/itineraries", tags, onTagsChange, entityId, initialStatus }: ItineraryFormProps) {
    const [meta, setMeta] = useState({
        title: initialData?.title ?? "",
        subtitle: initialData?.subtitle ?? "",
        description: initialData?.description ?? "",
        durationDays: initialData?.durationDays ?? "",
        budgetMin: initialData?.budgetMin ?? "",
        budgetMax: initialData?.budgetMax ?? "",
        currency: initialData?.currency ?? "INR",
        tripType: initialData?.tripType ?? "",
        difficulty: initialData?.difficulty ?? "",
        travelMode: initialData?.travelMode ?? "",
        stayNights: initialData?.stayNights ?? "",
        minPeople: initialData?.minPeople ?? "",
        maxPeople: initialData?.maxPeople ?? "",
        estimatedBudget: initialData?.estimatedBudget ?? "",
    });

    const [destinations, setDestinations] = useState<ItineraryFormValues["destinationIds"]>(
        initialData?.destinationIds ?? []
    );

    const [days, setDays] = useState<DayItem[]>(initialData?.days ?? []);
    const [error, setError] = useState<string | null>(null);

    function setMF(field: string, value: any) {
        setMeta((prev) => ({ ...prev, [field]: value }));
    }

    function addDestination(id: string, name: string) {
        if (destinations.some((d) => d.destinationId === id)) return;
        setDestinations((prev) => [...prev, { destinationId: id, destinationName: name, position: prev.length + 1 }]);
    }

    function removeDestination(id: string) {
        setDestinations((prev) => prev.filter((d) => d.destinationId !== id));
    }

    function addDay() {
        const nextNum = days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;
        setDays((prev) => [...prev, makeDay(nextNum)]);
    }

    function updateDay(i: number, d: DayItem) {
        setDays((prev) => { const next = [...prev]; next[i] = d; return next; });
    }

    function removeDay(i: number) {
        setDays((prev) => {
            const next = prev.filter((_, idx) => idx !== i);
            return next.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
        });
    }

    function num(v: any) { return v === "" || v === undefined ? undefined : Number(v); }

    const [pendingStatus, setPendingStatus] = useState<"DRAFT" | "PUBLISHED" | null>(null);

    async function handleSubmit(e: React.FormEvent, status: "DRAFT" | "PUBLISHED") {
        e.preventDefault();
        setError(null);
        const values: ItineraryFormValues = {
            title: meta.title || undefined,
            subtitle: meta.subtitle || undefined,
            description: meta.description || undefined,
            durationDays: num(meta.durationDays),
            budgetMin: num(meta.budgetMin),
            budgetMax: num(meta.budgetMax),
            currency: meta.currency || undefined,
            tripType: meta.tripType || undefined,
            difficulty: meta.difficulty || undefined,
            travelMode: meta.travelMode || undefined,
            stayNights: num(meta.stayNights),
            minPeople: num(meta.minPeople),
            maxPeople: num(meta.maxPeople),
            estimatedBudget: num(meta.estimatedBudget),
            destinationIds: destinations,
            days,
        };
        try {
            await onSubmit(values, status);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setPendingStatus(null);
        }
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-5">
            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* ── Meta ── */}
            <Section title="Basic Info">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Field label="Title">
                            <Input placeholder="e.g. 5 Days in Rajasthan" value={meta.title} onChange={(e) => setMF("title", e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Subtitle">
                        <Input placeholder="Short tagline" value={meta.subtitle} onChange={(e) => setMF("subtitle", e.target.value)} />
                    </Field>
                    <Field label="Duration (days)">
                        <Input type="number" placeholder="5" value={meta.durationDays} onChange={(e) => setMF("durationDays", e.target.value)} />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Description">
                            <Textarea rows={3} placeholder="Overview of the itinerary" value={meta.description} onChange={(e) => setMF("description", e.target.value)} />
                        </Field>
                    </div>
                    {onTagsChange && (
                        <div className="sm:col-span-2">
                            <Label className="mb-1.5 block text-sm font-medium">Tags</Label>
                            <TagInput entityType="ITINERARY" entityId={entityId} value={tags ?? []} onChange={onTagsChange} />
                        </div>
                    )}
                </div>
            </Section>

            {/* ── Details ── */}
            <Section title="Details">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Trip Type">
                        <Select value={meta.tripType} onValueChange={(v) => setMF("tripType", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {TRIP_TYPES.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Difficulty">
                        <Select value={meta.difficulty} onValueChange={(v) => setMF("difficulty", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Travel Mode">
                        <Select value={meta.travelMode} onValueChange={(v) => setMF("travelMode", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {TRAVEL_MODES.map((m) => <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Budget Min (₹)">
                        <Input type="number" placeholder="5000" value={meta.budgetMin} onChange={(e) => setMF("budgetMin", e.target.value)} />
                    </Field>
                    <Field label="Budget Max (₹)">
                        <Input type="number" placeholder="15000" value={meta.budgetMax} onChange={(e) => setMF("budgetMax", e.target.value)} />
                    </Field>
                    <Field label="Currency">
                        <Input placeholder="INR" value={meta.currency} onChange={(e) => setMF("currency", e.target.value)} />
                    </Field>
                    <Field label="Stay Nights">
                        <Input type="number" placeholder="4" value={meta.stayNights} onChange={(e) => setMF("stayNights", e.target.value)} />
                    </Field>
                    <Field label="Min People">
                        <Input type="number" placeholder="1" value={meta.minPeople} onChange={(e) => setMF("minPeople", e.target.value)} />
                    </Field>
                    <Field label="Max People">
                        <Input type="number" placeholder="10" value={meta.maxPeople} onChange={(e) => setMF("maxPeople", e.target.value)} />
                    </Field>
                </div>
            </Section>

            {/* ── Destinations ── */}
            <Section title="Destinations">
                {destinations.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {destinations.map((d) => (
                            <span key={d.destinationId} className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm">
                                {d.destinationName}
                                <button type="button" onClick={() => removeDestination(d.destinationId)} className="text-muted-foreground hover:text-destructive">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <DestinationCombobox
                    value=""
                    onChange={(id, name) => { if (id) addDestination(id, name); }}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Select destinations covered in this itinerary.</p>
            </Section>

            {/* ── Days ── */}
            <Section title={`Days (${days.length})`}>
                {days.length === 0 ? (
                    <p className="mb-4 text-sm text-muted-foreground text-center py-4">No days added yet.</p>
                ) : (
                    <div className="space-y-4 mb-4">
                        {days.map((day, i) => (
                            <DayEditor
                                key={day._key}
                                day={day}
                                index={i}
                                onChange={(updated) => updateDay(i, updated)}
                                onRemove={() => removeDay(i)}
                            />
                        ))}
                    </div>
                )}
                <Button type="button" variant="outline" className="w-full border-dashed" onClick={addDay}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Day
                </Button>
            </Section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                {initialStatus !== "PUBLISHED" && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={(e) => { setPendingStatus("DRAFT"); handleSubmit(e as any, "DRAFT"); }}
                    >
                        {isSubmitting && pendingStatus === "DRAFT" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save as Draft
                    </Button>
                )}
                <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={(e) => { setPendingStatus("PUBLISHED"); handleSubmit(e as any, "PUBLISHED"); }}
                >
                    {isSubmitting && pendingStatus === "PUBLISHED" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Save & Publish" : "Publish"}
                </Button>
            </div>
        </form>
    );
}
