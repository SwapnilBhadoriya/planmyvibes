"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { getItineraryColumns } from "./components/itinerary-columns";
import { useItineraries, type ItineraryListItem } from "@/hooks/use-itineraries";

export default function ItinerariesPage() {
    const { itineraries, isLoading, error, deleteItinerary } = useItineraries();
    const [deleting, setDeleting] = useState<ItineraryListItem | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const columns = getItineraryColumns({ onDelete: (i) => setDeleting(i) });

    async function handleDelete() {
        if (!deleting) return;
        setDeleteLoading(true);
        await deleteItinerary(deleting.id);
        setDeleteLoading(false);
        setDeleting(null);
    }

    return (
        <div>
            <AdminPageHeader
                title="Itineraries"
                subtitle="Day-by-day travel plans with activities and routes"
                action={
                    <Button size="sm" asChild>
                        <Link href="/admin/itineraries/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Itinerary
                        </Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <DataTable
                columns={columns}
                data={itineraries}
                isLoading={isLoading}
                searchKey="title"
                emptyMessage="No itineraries found. Create your first itinerary."
            />

            <ConfirmDialog
                open={!!deleting}
                onOpenChange={(open) => { if (!open) setDeleting(null); }}
                title="Delete itinerary"
                description={`Delete "${deleting?.title ?? "this itinerary"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleteLoading}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
