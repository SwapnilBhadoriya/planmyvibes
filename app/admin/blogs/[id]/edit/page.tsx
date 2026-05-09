"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogForm, type BlogFormValues } from "../../components/blog-form";
import { type Blog } from "../../components/blog-columns";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    async function handleSubmit(values: BlogFormValues, status: "DRAFT" | "PUBLISHED") {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    entityId: values.entityId || undefined,
                    type: values.type || undefined,
                    coverImage: values.coverImage ?? null,
                    status,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to update blog");
            router.push(`/admin/blogs/${id}`);
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
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-9 w-20" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
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
                title={`Edit: ${blog.title ?? "Untitled Blog"}`}
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/blogs/${id}`}>
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

            <BlogForm
                initialData={blog}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                cancelHref={`/admin/blogs/${id}`}
            />
        </div>
    );
}
