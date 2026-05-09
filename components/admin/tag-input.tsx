"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
    id: number;
    name: string;
}

interface TagInputProps {
    entityType: string;
    entityId?: string;          // undefined on new-entity forms (tags saved after create)
    value: string[];            // controlled list of tag names
    onChange: (tags: string[]) => void;
}

export function TagInput({ entityType, entityId, value, onChange }: TagInputProps) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load existing tags for the entity when editing
    useEffect(() => {
        if (!entityId) return;
        setLoadingInitial(true);
        fetch(`/api/tags/sync?entityType=${entityType}&entityId=${entityId}`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data.length) {
                    onChange(json.data.map((t: Tag) => t.name));
                }
            })
            .catch(() => {})
            .finally(() => setLoadingInitial(false));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityId, entityType]);

    const search = useCallback((q: string) => {
        setLoading(true);
        fetch(`/api/tags?search=${encodeURIComponent(q)}&limit=10`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setSuggestions(json.data ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    function handleInputChange(q: string) {
        setInput(q);
        setOpen(true);
        if (timer.current) clearTimeout(timer.current);
        if (q.trim()) {
            timer.current = setTimeout(() => search(q.trim()), 250);
        } else {
            setSuggestions([]);
        }
    }

    function addTag(name: string) {
        const trimmed = name.toLowerCase().trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
        setInput("");
        setSuggestions([]);
        setOpen(false);
        inputRef.current?.focus();
    }

    function removeTag(name: string) {
        onChange(value.filter((t) => t !== name));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (input.trim()) addTag(input);
        } else if (e.key === "Backspace" && !input && value.length) {
            removeTag(value[value.length - 1]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    // Close dropdown on outside click
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const filteredSuggestions = suggestions.filter((s) => !value.includes(s.name));
    const showCreate = input.trim() && !suggestions.some((s) => s.name === input.toLowerCase().trim()) && !value.includes(input.toLowerCase().trim());

    return (
        <div ref={containerRef} className="relative">
            <div
                className={cn(
                    "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-sm transition-colors",
                    "focus-within:ring-1 focus-within:ring-ring"
                )}
                onClick={() => inputRef.current?.focus()}
            >
                {loadingInitial ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                ) : (
                    value.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {tag}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                                className="text-primary/60 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))
                )}
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (input.trim()) setOpen(true); }}
                    placeholder={value.length === 0 ? "Add tags… (Enter or comma to add)" : ""}
                    className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
            </div>

            {open && (filteredSuggestions.length > 0 || showCreate) && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-border bg-white shadow-md">
                    {filteredSuggestions.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); addTag(tag.name); }}
                            className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-muted first:rounded-t-md"
                        >
                            {tag.name}
                        </button>
                    ))}
                    {showCreate && (
                        <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); addTag(input); }}
                            className={cn(
                                "flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm hover:bg-muted last:rounded-b-md",
                                filteredSuggestions.length === 0 && "rounded-t-md"
                            )}
                        >
                            <span className="text-muted-foreground">Create</span>
                            <span className="font-medium text-primary">"{input.toLowerCase().trim()}"</span>
                        </button>
                    )}
                </div>
            )}

            <p className="mt-1 text-xs text-muted-foreground">Press Enter or comma to add a tag. Type to search existing tags.</p>
        </div>
    );
}

// Helper: call after entity is saved to sync tags server-side
export async function syncTags(entityType: string, entityId: string, tagNames: string[]) {
    await fetch("/api/tags/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId, tagNames }),
    });
}
