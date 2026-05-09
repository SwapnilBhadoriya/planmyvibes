"use client";

import { useState, useEffect } from "react";

export interface ItineraryListItem {
    id: string;
    title: string | null;
    durationDays: number | null;
    tripType: string | null;
    difficulty: string | null;
    travelMode: string | null;
    status: "DRAFT" | "PUBLISHED";
    createdAt: string;
    itineraryDestinations: { destination: { id: string; name: string } }[];
}

export function useItineraries() {
    const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/itineraries?limit=100")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setItineraries(json.data ?? []);
                else setError(json.message ?? "Failed to load itineraries");
            })
            .catch(() => setError("Failed to load itineraries"))
            .finally(() => setIsLoading(false));
    }, []);

    async function deleteItinerary(id: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/itineraries/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            setItineraries((prev) => prev.filter((i) => i.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    }

    return { itineraries, isLoading, error, deleteItinerary };
}
