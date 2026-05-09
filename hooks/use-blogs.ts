"use client";

import { useState, useEffect } from "react";
import { type Blog } from "@/app/admin/blogs/components/blog-columns";

export function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/blogs?limit=100")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setBlogs(json.data ?? []);
                else setError(json.message ?? "Failed to load blogs");
            })
            .catch(() => setError("Failed to load blogs"))
            .finally(() => setIsLoading(false));
    }, []);

    async function deleteBlog(id: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to delete");
            setBlogs((prev) => prev.filter((b) => b.id !== id));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    }

    return { blogs, isLoading, error, deleteBlog };
}
