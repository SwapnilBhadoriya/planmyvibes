"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { useDestinations } from "@/hooks/use-destinations";
import { getDestinationColumns, type Destination } from "./components/destination-columns";

const TYPE_FILTER_OPTIONS = [
    { label: "Country", value: "country" },
    { label: "State", value: "state" },
    { label: "City", value: "city" },
];

const STATUS_FILTER_OPTIONS = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
];

export default function DestinationsPage() {
    const { destinations, isLoading, error, clearError, deleteDestination } = useDestinations();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingDest, setDeletingDest] = useState<Destination | undefined>();
    const [deleting, setDeleting] = useState(false);

    function handleDeleteClick(dest: Destination) {
        setDeletingDest(dest);
        setDeleteOpen(true);
    }

    async function handleConfirmDelete() {
        if (!deletingDest) return;
        setDeleting(true);
        const ok = await deleteDestination(deletingDest.id);
        setDeleting(false);
        if (ok) {
            setDeleteOpen(false);
            setDeletingDest(undefined);
        }
    }

    const columns = getDestinationColumns({ onDelete: handleDeleteClick });

    return (
        <div>
            <AdminPageHeader
                title="Destinations"
                subtitle="Manage countries, states, and cities."
                action={
                    <Button size="sm" asChild>
                        <Link href="/admin/destinations/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Destination
                        </Link>
                    </Button>
                }
            />

            {error && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={clearError}><X className="h-4 w-4" /></button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={destinations}
                searchKey="name"
                filterOptions={[
                    { key: "type", label: "Type", options: TYPE_FILTER_OPTIONS },
                    { key: "isActive", label: "Status", options: STATUS_FILTER_OPTIONS },
                ]}
                isLoading={isLoading}
                emptyMessage="No destinations found. Add your first destination."
            />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeletingDest(undefined); }}
                title="Delete destination"
                description={
                    deletingDest
                        ? `Delete "${deletingDest.name}"? This cannot be undone. Destinations with child entries cannot be deleted.`
                        : ""
                }
                onConfirm={handleConfirmDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
