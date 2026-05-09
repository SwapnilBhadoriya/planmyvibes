"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationOption {
    id: string;
    name: string;
    type: string;
    country: string | null;
    state: string | null;
}

interface DestinationComboboxProps {
    value: string;
    onChange: (id: string, name: string) => void;
    error?: string;
    disabled?: boolean;
}

export function DestinationCombobox({ value, onChange, error, disabled }: DestinationComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [destinations, setDestinations] = useState<DestinationOption[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((q: string) => {
        setLoading(true);
        const params = new URLSearchParams({ limit: "15" });
        if (q) params.set("search", q);
        fetch(`/api/destinations?${params}`)
            .then((r) => r.json())
            .then((json) => { if (json.success) setDestinations(json.data ?? []); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Initial load of selected item label
    useEffect(() => {
        if (!value) { setSelectedLabel(""); return; }
        fetch(`/api/destinations/${value}`)
            .then((r) => r.json())
            .then((json) => { if (json.success) setSelectedLabel(json.data?.name ?? ""); })
            .catch(() => {});
    }, [value]);

    // Debounced search when query changes
    useEffect(() => {
        if (!open) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => search(query), 300);
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, [query, open, search]);

    // Load initial results when dropdown opens
    useEffect(() => {
        if (open) {
            search(query);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(dest: DestinationOption) {
        onChange(dest.id, dest.name);
        setSelectedLabel(dest.name);
        setOpen(false);
        setQuery("");
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onChange("", "");
        setSelectedLabel("");
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((p) => !p)}
                className={cn(
                    "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
                    "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-destructive",
                    open && "ring-1 ring-ring"
                )}
            >
                <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
                    {selectedLabel || "Search destination…"}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                    {selectedLabel && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) => e.key === "Enter" && handleClear(e as any)}
                            className="rounded p-0.5 hover:bg-destructive/10 hover:text-destructive"
                        >
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
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type to search…"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
                    </div>

                    <ul className="max-h-52 overflow-y-auto p-1">
                        {!loading && destinations.length === 0 ? (
                            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                                {query ? "No destinations match" : "No destinations found"}
                            </li>
                        ) : (
                            destinations.map((dest) => (
                                <li
                                    key={dest.id}
                                    onClick={() => handleSelect(dest)}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        dest.id === value && "bg-accent/60"
                                    )}
                                >
                                    <Check className={cn("h-4 w-4 shrink-0", dest.id === value ? "opacity-100" : "opacity-0")} />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{dest.name}</p>
                                        <p className="truncate text-xs text-muted-foreground capitalize">
                                            {[dest.type, dest.state, dest.country].filter(Boolean).join(" · ")}
                                        </p>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
}
