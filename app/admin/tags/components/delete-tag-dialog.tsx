"use client";

import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { type Tag } from "./tag-columns";

interface DeleteTagDialogProps {
    tag?: Tag;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading?: boolean;
}

export function DeleteTagDialog({ tag, open, onOpenChange, onConfirm, loading }: DeleteTagDialogProps) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete tag"
            description={tag ? `Are you sure you want to delete "${tag.name}"? This action cannot be undone.` : ""}
            onConfirm={onConfirm}
            loading={loading}
            confirmLabel="Delete"
            variant="destructive"
        />
    );
}
