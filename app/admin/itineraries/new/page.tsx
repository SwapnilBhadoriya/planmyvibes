"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { ItineraryForm, type ItineraryFormValues } from "../components/itinerary-form";
import { toPayload } from "../components/itinerary-payload";
import { syncTags } from "@/components/admin/tag-input";

export default function NewItineraryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    async function handleSubmit(values: ItineraryFormValues, status: "DRAFT" | "PUBLISHED") {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/itineraries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...toPayload(values), status }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create itinerary");
            await syncTags("ITINERARY", json.data.id, tags);
            router.push(`/admin/itineraries/${json.data.id}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="New Itinerary"
                subtitle="Build a day-by-day travel plan"
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/itineraries"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <ItineraryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} tags={tags} onTagsChange={setTags} />
        </div>
    );
}
