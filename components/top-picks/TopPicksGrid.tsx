"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, HeartAddIcon } from "@hugeicons/core-free-icons";

type BadgeColor = "green" | "blue" | "purple" | "orange" | "pink" | "teal" | "red" | "indigo";

type Collection = {
    badge: string;
    badgeColor: BadgeColor;
    title: string;
    location: string;
    count: string;
    views: string;
    likes: string;
    gradient: string;
};

const BADGE_STYLES: Record<BadgeColor, string> = {
    green:  "bg-green-500",
    blue:   "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink:   "bg-pink-500",
    teal:   "bg-teal-500",
    red:    "bg-red-500",
    indigo: "bg-indigo-500",
};

const ALL_COLLECTIONS: Collection[] = [
    { badge: "Trending",        badgeColor: "green",  title: "Top Places in",           location: "Mumbai",     count: "25 places",     views: "15K", likes: "1.2K", gradient: "from-teal-400 via-cyan-600 to-blue-800" },
    { badge: "Top Rated",       badgeColor: "blue",   title: "Best Cafes in",           location: "Chennai",    count: "18 cafes",      views: "12K", likes: "892",  gradient: "from-green-500 via-emerald-600 to-teal-800" },
    { badge: "Popular",         badgeColor: "purple", title: "Weekend Getaways from",   location: "Delhi",      count: "15 places",     views: "10K", likes: "756",  gradient: "from-blue-400 via-indigo-600 to-purple-800" },
    { badge: "Hidden Gem",      badgeColor: "orange", title: "Hidden Beaches in",       location: "Goa",        count: "12 beaches",    views: "8K",  likes: "623",  gradient: "from-orange-400 via-amber-500 to-yellow-600" },
    { badge: "Foodie Pick",     badgeColor: "red",    title: "Must Try Street Food in", location: "Jaipur",     count: "20 places",     views: "9K",  likes: "689",  gradient: "from-red-400 via-rose-500 to-pink-700" },
    { badge: "Family Friendly", badgeColor: "teal",   title: "Family Attractions in",   location: "Bangalore",  count: "15 places",     views: "7K",  likes: "512",  gradient: "from-purple-400 via-violet-500 to-indigo-700" },
    { badge: "Romantic",        badgeColor: "pink",   title: "Romantic Spots in",       location: "Udaipur",    count: "10 places",     views: "6K",  likes: "445",  gradient: "from-pink-400 via-rose-500 to-red-600" },
    { badge: "Adventure",       badgeColor: "indigo", title: "Adventure Activities in", location: "Manali",     count: "12 activities", views: "5K",  likes: "378",  gradient: "from-slate-500 via-blue-600 to-indigo-800" },
    { badge: "Cultural",        badgeColor: "purple", title: "Heritage Walks in",       location: "Varanasi",   count: "14 spots",      views: "4K",  likes: "310",  gradient: "from-amber-500 via-orange-600 to-red-700" },
    { badge: "Top Rated",       badgeColor: "green",  title: "Best Stays in",           location: "Coorg",      count: "10 resorts",    views: "3K",  likes: "278",  gradient: "from-green-400 via-lime-500 to-teal-700" },
    { badge: "Trending",        badgeColor: "blue",   title: "Scenic Drives in",        location: "Himachal",   count: "8 routes",      views: "6K",  likes: "490",  gradient: "from-sky-400 via-blue-500 to-indigo-700" },
    { badge: "Luxury",          badgeColor: "indigo", title: "Premium Experiences in",  location: "Rajasthan",  count: "16 places",     views: "5K",  likes: "401",  gradient: "from-rose-400 via-fuchsia-500 to-purple-700" },
];

const PAGE_SIZE = 8;

function CollectionCard({ item }: { item: Collection }) {
    return (
        <div className={`relative h-48 sm:h-56 xl:h-64 w-full rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-b ${item.gradient}`}>

            {/* Badge */}
            <span className={`absolute top-2.5 left-2.5 ${BADGE_STYLES[item.badgeColor]} text-white text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5`}>
                {item.badge}
            </span>

            {/* Save */}
            <button className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                <HugeiconsIcon icon={HeartAddIcon} size={12} strokeWidth={2} className="text-white" />
            </button>

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 flex flex-col justify-center">
                <p className="text-[11px] sm:text-xs text-white/80 leading-none mb-1 truncate">{item.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white leading-tight truncate">{item.location}</p>
                <p className="text-xs text-white/70 mt-1 mb-2 truncate">{item.count}</p>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={ViewIcon} size={11} strokeWidth={2} className="text-white/60 shrink-0" />
                    <span className="text-xs text-white/70">{item.views}</span>
                    <span className="text-xs text-white/40 mx-0.5">·</span>
                    <HugeiconsIcon icon={HeartAddIcon} size={11} strokeWidth={2} className="text-white/60 shrink-0" />
                    <span className="text-xs text-white/70">{item.likes}</span>
                </div>
            </div>
        </div>
    );
}

export default function TopPicksGrid() {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(ALL_COLLECTIONS.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const visible = ALL_COLLECTIONS.slice(start, start + PAGE_SIZE);

    const goTo = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    ✨ Popular Collections
                </h2>
                <span className="text-xs text-gray-400">
                    {start + 1}–{Math.min(start + PAGE_SIZE, ALL_COLLECTIONS.length)} of {ALL_COLLECTIONS.length}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                {visible.map((item) => (
                    <CollectionCard key={item.location + item.title} item={item} />
                ))}
            </div>

            {/* Pagination */}
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
                                p === page
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
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
        </section>
    );
}
