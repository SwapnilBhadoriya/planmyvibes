"use client";

import { useState, useEffect, useCallback } from "react";
import { type Destination } from "@/app/admin/destinations/components/destination-columns";

interface UseDestinationsReturn {
    destinations: Destination[];
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    deleteDestination: (id: string) => Promise<boolean>;
    refresh: () => void;
}

export function useDestinations(): UseDestinationsReturn {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDestinations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/destinations?limit=100");
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to load destinations");
            setDestinations(json.data ?? []);
        } catch (e: any) {
            setError(e.message ?? "Failed to load destinations");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchDestinations(); }, [fetchDestinations]);

    async function deleteDestination(id: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete destination");
            setDestinations((prev) => prev.filter((d) => d.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message ?? "Failed to delete destination");
            return false;
        }
    }

    return {
        destinations,
        isLoading,
        error,
        clearError: () => setError(null),
        deleteDestination,
        refresh: fetchDestinations,
    };
}
