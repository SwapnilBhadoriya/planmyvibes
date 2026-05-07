"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { PlaceForm } from "../components/place-form";

export default function NewPlacePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/places", { method: "POST", body: formData });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create place");
            router.push("/admin/places");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="Add Place"
                subtitle="Create a new place"
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <PlaceForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                cancelHref="/admin/places"
            />
        </div>
    );
}
