"use client";

import { useState } from "react";
import { Plus, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { useTags } from "@/hooks/use-tags";
import { getTagColumns, type Tag } from "./components/tag-columns";
import { TagFormModal } from "./components/tag-form-modal";
import { DeleteTagDialog } from "./components/delete-tag-dialog";

const TYPE_FILTER_OPTIONS = [
    { label: "Vibe", value: "vibe" },
    { label: "Budget", value: "budget" },
    { label: "Audience", value: "audience" },
    { label: "Category", value: "category" },
];

export default function TagsPage() {
    const { tags, isLoading, error, clearError, serverSide, createTag, updateTag, deleteTag } = useTags();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | undefined>();
    const [deletingTag, setDeletingTag] = useState<Tag | undefined>();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    function handleEdit(tag: Tag) {
        setEditingTag(tag);
        setFormOpen(true);
    }

    function handleDeleteClick(tag: Tag) {
        setDeletingTag(tag);
        setDeleteOpen(true);
    }

    async function handleSave(name: string, type: string) {
        setSaving(true);
        const ok = editingTag
            ? await updateTag(editingTag.id, name, type)
            : await createTag(name, type);
        setSaving(false);
        if (ok) {
            setFormOpen(false);
            setEditingTag(undefined);
        }
    }

    async function handleConfirmDelete() {
        if (!deletingTag) return;
        setDeleting(true);
        const ok = await deleteTag(deletingTag.id);
        setDeleting(false);
        if (ok) {
            setDeleteOpen(false);
            setDeletingTag(undefined);
        }
    }

    const columns = getTagColumns({ onEdit: handleEdit, onDelete: handleDeleteClick });

    return (
        <div>
            <AdminPageHeader
                title="Tags"
                subtitle="Manage tags used across destinations, itineraries, and places."
                action={
                    <Button size="sm" onClick={() => { setEditingTag(undefined); setFormOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tag
                    </Button>
                }
            />

            {error && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={clearError} className="rounded hover:opacity-70">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={tags}
                searchKey="name"
                filterOptions={[{ key: "type", label: "Type", options: TYPE_FILTER_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="No tags found. Add your first tag."
                serverSide={serverSide}
            />

            <TagFormModal
                open={formOpen}
                onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingTag(undefined); }}
                tag={editingTag}
                onSave={handleSave}
                loading={saving}
            />

            <DeleteTagDialog
                tag={deletingTag}
                open={deleteOpen}
                onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeletingTag(undefined); }}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    );
}
