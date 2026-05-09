"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/dialogs/confirm-dialog";
import { type Blog } from "../components/blog-columns";

export default function ViewBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/blogs/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) { setNotFound(true); return; }
                setBlog(json.data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            router.push("/admin/blogs");
        } catch (e: any) {
            setDeleteError(e.message);
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-9 w-40" />
                </div>
                <Skeleton className="mb-4 h-6 w-48" />
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        );
    }

    if (notFound || !blog) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Blog not found</p>
                <Button asChild variant="outline">
                    <Link href="/admin/blogs">Back to list</Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title={blog.title ?? "Untitled Blog"}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/blogs">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/admin/blogs/${id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                }
            />

            {deleteError && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {deleteError}
                </div>
            )}

            {/* Cover image */}
            {blog.coverImage && (
                <div className="mb-5 overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blog.coverImage} alt={blog.title ?? "Cover"} className="h-64 w-full object-cover sm:h-80" />
                </div>
            )}

            {/* Meta badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-mono text-xs">
                    {blog.entityType}
                </Badge>
                {blog.type && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {blog.type}
                    </Badge>
                )}
                {blog.slug && (
                    <span className="font-mono text-xs text-muted-foreground">/{blog.slug}</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            </div>

            {/* Rendered content */}
            <div className="rounded-xl border border-border bg-white p-5 sm:p-8">
                <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
                />
            </div>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete blog"
                description={`Delete "${blog.title ?? "this blog"}"? This cannot be undone.`}
                onConfirm={handleDelete}
                loading={deleting}
                confirmLabel="Delete"
                variant="destructive"
            />
        </div>
    );
}
