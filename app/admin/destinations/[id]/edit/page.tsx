"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { DestinationForm } from "../../components/destination-form";
import { type DestinationDetail } from "../../components/destination-columns";

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [destination, setDestination] = useState<DestinationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch(`/api/destinations/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setDestination(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(`/api/destinations/${id}`, {
                method: "PUT",
                body: formData,
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update destination");
            router.push(`/admin/destinations/${id}`);
        } catch (e: any) {
            setSubmitError(e.message ?? "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete destination");
            router.push("/admin/destinations");
        } catch (e: any) {
            setSubmitError(e.message ?? "Failed to delete");
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-9 w-28" />
                </div>
                <div className="space-y-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Destination not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/destinations">Back to list</Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title={destination?.name ?? "Edit Destination"}
                subtitle={destination ? `${destination.type} · ${destination.slug}` : ""}
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/destinations/${id}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                }
            />

            {submitError && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {submitError}
                </div>
            )}
            {destination && (
                <DestinationForm
                    initialData={destination}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    cancelHref={`/admin/destinations/${id}`}
                />
            )}

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete destination"
                description={`Delete "${destination?.name}"? This cannot be undone. Destinations with child entries cannot be deleted.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
