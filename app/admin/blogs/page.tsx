"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { getBlogColumns, type Blog } from "./components/blog-columns";
import { useBlogs } from "@/hooks/use-blogs";

export default function BlogsPage() {
    const { blogs, isLoading, error, deleteBlog } = useBlogs();
    const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const columns = getBlogColumns({ onDelete: (blog) => setDeletingBlog(blog) });

    async function handleDelete() {
        if (!deletingBlog) return;
        setDeleteLoading(true);
        await deleteBlog(deletingBlog.id);
        setDeleteLoading(false);
        setDeletingBlog(null);
    }

    return (
        <div>
            <AdminPageHeader
                title="Blogs"
                subtitle="Manage blog posts and travel guides"
                action={
                    <Button size="sm" asChild>
                        <Link href="/admin/blogs/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Blog
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
                data={blogs}
                isLoading={isLoading}
                searchKey="title"
                emptyMessage="No blogs found. Write your first blog post."
            />

            <ConfirmDialog
                open={!!deletingBlog}
                onOpenChange={(open) => { if (!open) setDeletingBlog(null); }}
                title="Delete blog"
                description={`Delete "${deletingBlog?.title ?? "this blog"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleteLoading}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
