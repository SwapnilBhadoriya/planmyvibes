"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { BlogForm, type BlogFormValues } from "../components/blog-form";

export default function NewBlogPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(values: BlogFormValues, status: "DRAFT" | "PUBLISHED") {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    entityId: values.entityId || undefined,
                    type: values.type || undefined,
                    coverImage: values.coverImage || undefined,
                    status,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create blog");
            router.push("/admin/blogs");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="New Blog"
                subtitle="Write a new blog post or travel guide"
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/blogs">
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

            <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}
