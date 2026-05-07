"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { type Tag } from "@/app/admin/tags/components/tag-columns";

export interface TagsServerSide {
    pageCount: number;
    pagination: { pageIndex: number; pageSize: number };
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    search: string;
    onSearchChange: (value: string) => void;
    filterValues: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
}

interface UseTagsReturn {
    tags: Tag[];
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    serverSide: TagsServerSide;
    createTag: (name: string, type: string) => Promise<boolean>;
    updateTag: (id: number, name: string, type: string) => Promise<boolean>;
    deleteTag: (id: number) => Promise<boolean>;
}

export function useTags(): UseTagsReturn {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Server-side controlled state
    const [pageIndex, setPageIndex] = useState(0); // 0-based (TanStack convention)
    const [pageSize, setPageSize] = useState(20);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");

    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", String(pageIndex + 1)); // API is 1-based
        params.set("limit", String(pageSize));
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (type) params.set("type", type);

        setIsLoading(true);
        fetch(`/api/tags?${params}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) throw new Error(json.message ?? "Failed to load tags");
                setTags(json.data);
                setPageCount(json.pagination.totalPages || 1);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setIsLoading(false));
    }, [pageIndex, pageSize, debouncedSearch, type]);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPageIndex(0); // reset to first page on new search
    }

    function handleFilterChange(key: string, value: string) {
        if (key === "type") setType(value);
        setPageIndex(0); // reset to first page on filter change
    }

    function handlePaginationChange(newPageIndex: number, newPageSize: number) {
        setPageIndex(newPageIndex);
        setPageSize(newPageSize);
    }

    async function createTag(name: string, type: string): Promise<boolean> {
        try {
            const res = await fetch("/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, type: type || undefined }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create tag");
            // Prepend to current page (will re-sort on next fetch)
            setTags((prev) => [json.data, ...prev]);
            return true;
        } catch (e: any) {
            setError(e.message ?? "Failed to create tag");
            return false;
        }
    }

    async function updateTag(id: number, name: string, type: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/tags/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, type: type || undefined }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update tag");
            setTags((prev) => prev.map((t) => (t.id === id ? json.data : t)));
            return true;
        } catch (e: any) {
            setError(e.message ?? "Failed to update tag");
            return false;
        }
    }

    async function deleteTag(id: number): Promise<boolean> {
        try {
            const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete tag");
            setTags((prev) => prev.filter((t) => t.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message ?? "Failed to delete tag");
            return false;
        }
    }

    return {
        tags,
        isLoading,
        error,
        clearError: () => setError(null),
        serverSide: {
            pageCount,
            pagination: { pageIndex, pageSize },
            onPaginationChange: handlePaginationChange,
            search,
            onSearchChange: handleSearchChange,
            filterValues: { type },
            onFilterChange: handleFilterChange,
        },
        createTag,
        updateTag,
        deleteTag,
    };
}
