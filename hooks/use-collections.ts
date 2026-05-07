"use client";

import { useState, useEffect } from "react";
import { type Collection } from "@/app/admin/collections/components/collection-columns";

export function useCollections() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/collections")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setCollections(json.data ?? []);
                else setError(json.message ?? "Failed to load collections");
            })
            .catch(() => setError("Failed to load collections"))
            .finally(() => setIsLoading(false));
    }, []);

    async function deleteCollection(id: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            setCollections((prev) => prev.filter((c) => c.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    }

    return { collections, isLoading, error, deleteCollection };
}
