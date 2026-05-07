"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceForm } from "../../components/place-form";
import { type PlaceDetail } from "../../components/place-columns";

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [place, setPlace] = useState<PlaceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/places/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setPlace(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/places/${id}`, { method: "PUT", body: formData });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update place");
            router.push(`/admin/places/${id}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-9 w-20" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (notFound || !place) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Place not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/places">Back to list</Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title={`Edit: ${place.name}`}
                subtitle={place.destination?.name}
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/places/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <PlaceForm
                initialData={place}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                cancelHref={`/admin/places/${id}`}
            />
        </div>
    );
}
