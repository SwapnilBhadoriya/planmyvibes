"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/destinations")
            .then((r) => r.json())
            .then((json) => { if (json.success) setDestinations(json.data); })
            .finally(() => setLoading(false));
    }, []);

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

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    const selected = destinations.find((d) => d.id === value);

    const filtered = destinations
        .filter((d) =>
            !query ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            (d.country ?? "").toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);

    function handleSelect(dest: DestinationOption) {
        onChange(dest.id, dest.name);
        setOpen(false);
        setQuery("");
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onChange("", "");
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
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
                <span className={cn("truncate", !selected && "text-muted-foreground")}>
                    {loading ? "Loading destinations…" : selected ? selected.name : "Search destination…"}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                    {selected && (
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

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-md">
                    {/* Search input */}
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type to search…"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* List */}
                    <ul className="max-h-52 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                                {query ? "No destinations match your search" : "No destinations found"}
                            </li>
                        ) : (
                            filtered.map((dest) => (
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
