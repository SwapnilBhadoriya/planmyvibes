"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { getCollectionColumns, type Collection } from "./components/collection-columns";
import { useCollections } from "@/hooks/use-collections";

export default function CollectionsPage() {
    const { collections, isLoading, error, deleteCollection } = useCollections();
    const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const columns = getCollectionColumns({
        onDelete: (collection) => setDeletingCollection(collection),
    });

    async function handleDelete() {
        if (!deletingCollection) return;
        setDeleteLoading(true);
        await deleteCollection(deletingCollection.id);
        setDeleteLoading(false);
        setDeletingCollection(null);
    }

    return (
        <div>
            <AdminPageHeader
                title="Collections"
                subtitle="Curated place lists like Top 10 places in a destination"
                action={
                    <Button size="sm" asChild>
                        <Link href="/admin/collections/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Collection
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
                data={collections}
                isLoading={isLoading}
                searchKey="title"
                emptyMessage="No collections found. Create your first collection."
            />

            <ConfirmDialog
                open={!!deletingCollection}
                onOpenChange={(open) => { if (!open) setDeletingCollection(null); }}
                title="Delete collection"
                description={`Delete "${deletingCollection?.title ?? "this collection"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleteLoading}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
