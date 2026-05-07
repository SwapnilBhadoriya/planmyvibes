"use client";

import { useState, useEffect } from "react";
import { type Place } from "@/app/admin/places/components/place-columns";

export function usePlaces() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/places")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setPlaces(json.data ?? []);
                else setError(json.message ?? "Failed to load places");
            })
            .catch(() => setError("Failed to load places"))
            .finally(() => setIsLoading(false));
    }, []);

    async function deletePlace(id: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            setPlaces((prev) => prev.filter((p) => p.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    }

    return { places, isLoading, error, deletePlace };
}
