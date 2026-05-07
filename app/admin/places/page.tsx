"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { getPlaceColumns, type Place } from "./components/place-columns";
import { usePlaces } from "@/hooks/use-places";

export default function PlacesPage() {
    const { places, isLoading, error, deletePlace } = usePlaces();
    const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const columns = getPlaceColumns({
        onDelete: (place) => setDeletingPlace(place),
    });

    async function handleDelete() {
        if (!deletingPlace) return;
        setDeleteLoading(true);
        await deletePlace(deletingPlace.id);
        setDeleteLoading(false);
        setDeletingPlace(null);
    }

    return (
        <div>
            <AdminPageHeader
                title="Places"
                subtitle="Manage attractions, restaurants, hotels and more"
                action={
                    <Button size="sm" asChild>
                        <Link href="/admin/places/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Place
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
                data={places}
                isLoading={isLoading}
                searchKey="type"
                emptyMessage="No places found. Add your first place."
            />

            <ConfirmDialog
                open={!!deletingPlace}
                onOpenChange={(open) => { if (!open) setDeletingPlace(null); }}
                title="Delete place"
                description={`Delete "${deletingPlace?.name}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleteLoading}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
