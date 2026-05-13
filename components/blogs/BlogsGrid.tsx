"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, HeartAddIcon, ViewIcon } from "@hugeicons/core-free-icons";

type Blog = {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: string;
    createdAt: string;
    coverImage: string | null;
};

const CATEGORY_COLORS = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-teal-500",
];

const GRADIENTS = [
    "from-purple-400 via-violet-500 to-indigo-700",
    "from-pink-400 via-rose-500 to-red-600",
    "from-teal-400 via-cyan-600 to-blue-800",
    "from-green-500 via-emerald-600 to-teal-800",
    "from-orange-400 via-amber-500 to-yellow-600",
    "from-blue-400 via-indigo-600 to-purple-800",
];

function readTime(content: string) {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const badgeColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
    const mins = readTime(blog.content);

    return (
        <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white flex flex-col">
            {/* Cover */}
            <div className={`relative h-40 sm:h-48 xl:h-52 w-full bg-gradient-to-b ${gradient} shrink-0`}>
                {blog.coverImage && (
                    <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                    />
                )}
                <span className={`absolute top-2.5 left-2.5 ${badgeColor} text-white text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5`}>
                    Article
                </span>
                <button className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                    <HugeiconsIcon icon={HeartAddIcon} size={12} strokeWidth={2} className="text-white" />
                </button>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
                    {blog.content.replace(/<[^>]*>/g, "").slice(0, 120)}…
                </p>

                <div className="flex items-center gap-3 mt-1 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <HugeiconsIcon icon={Clock01Icon} size={10} strokeWidth={2} className="shrink-0" />
                        {mins} min read
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(blog.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
                        <HugeiconsIcon icon={ViewIcon} size={10} strokeWidth={2} className="shrink-0" />
                        Read
                    </span>
                </div>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse bg-white">
            <div className="h-40 sm:h-48 xl:h-52 bg-gray-200" />
            <div className="p-3 sm:p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
        </div>
    );
}

const PAGE_SIZE = 8;

export default function BlogsGrid() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/blogs?page=${page}&limit=${PAGE_SIZE}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.success) throw new Error(json.message || "Failed to load");
                setBlogs(json.data);
                setTotal(json.pagination.total);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;

    const goTo = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    ✍️ Latest Articles
                </h2>
                {!loading && !error && (
                    <span className="text-xs text-gray-400">
                        {total === 0 ? "0 articles" : `${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total}`}
                    </span>
                )}
            </div>

            {error && (
                <div className="py-16 text-center text-sm text-red-500">{error}</div>
            )}

            {!error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                    {loading
                        ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
                        : blogs.length === 0
                            ? <p className="col-span-full py-16 text-center text-sm text-gray-400">No articles yet. Check back soon!</p>
                            : blogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} />)
                    }
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Prev
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => goTo(p)}
                                className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                                    p === page ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => goTo(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
}
