"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon, Location01Icon, Clock01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const DESTINATIONS = [
    { name: "Goa", country: "India", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&q=80", href: "/destinations" },
    { name: "Manali", country: "India", image: "https://images.unsplash.com/photo-1548013441-c3b5c5e5f29a?w=80&q=80", href: "/destinations" },
    { name: "Rajasthan", country: "India", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=80&q=80", href: "/destinations" },
    { name: "Mumbai", country: "India", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=80&q=80", href: "/destinations" },
];

const BLOGS = [
    { title: "Best Time to Visit Goa for the Perfect Getaway", readTime: "8 min read", href: "/blog/1" },
    { title: "Top 7 Street Foods You Must Try in India", readTime: "6 min read", href: "/blog/2" },
    { title: "How to Plan a Budget Trip to Rajasthan", readTime: "7 min read", href: "/blog/3" },
];

const TOP_PICKS = [
    { title: "Top 10 Places in Mumbai", count: 10, href: "/top-picks/1" },
    { title: "Best Beaches in Goa", count: 8, href: "/top-picks/2" },
    { title: "Hidden Gems of Rajasthan", count: 12, href: "/top-picks/3" },
];

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setQuery("");
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search destinations, blogs, top picks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                    />
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[70vh] p-5 flex flex-col gap-6">

                    {/* Top Destinations */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Destinations</p>
                            <Link href="/destinations" onClick={onClose} className="text-xs text-purple-600 font-semibold flex items-center gap-0.5 hover:text-purple-700">
                                View all <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2.5} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {DESTINATIONS.map((d) => (
                                <Link key={d.name} href={d.href} onClick={onClose} className="group flex flex-col gap-2 cursor-pointer">
                                    <div className="relative h-20 rounded-xl overflow-hidden">
                                        <Image src={d.image} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{d.name}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-0.5">
                                            <HugeiconsIcon icon={Location01Icon} size={10} strokeWidth={1.8} />
                                            {d.country}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Blogs */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blogs</p>
                            <Link href="/blog" onClick={onClose} className="text-xs text-purple-600 font-semibold flex items-center gap-0.5 hover:text-purple-700">
                                View all <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2.5} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {BLOGS.map((b) => (
                                <Link key={b.title} href={b.href} onClick={onClose} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-50 group transition-colors">
                                    <p className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors line-clamp-1">{b.title}</p>
                                    <span className="text-xs text-gray-400 shrink-0 ml-3 flex items-center gap-1">
                                        <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.8} />
                                        {b.readTime}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Picks */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Picks</p>
                            <Link href="/top-picks" onClick={onClose} className="text-xs text-purple-600 font-semibold flex items-center gap-0.5 hover:text-purple-700">
                                View all <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2.5} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {TOP_PICKS.map((p) => (
                                <Link key={p.title} href={p.href} onClick={onClose} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-50 group transition-colors">
                                    <p className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">{p.title}</p>
                                    <span className="text-xs text-gray-400 shrink-0 ml-3">{p.count} places</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
