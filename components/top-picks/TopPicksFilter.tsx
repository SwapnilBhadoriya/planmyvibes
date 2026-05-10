"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterHorizontalIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

const CATEGORIES = [
    { label: "Places",      emoji: "📍" },
    { label: "Cafes",       emoji: "☕" },
    { label: "Experiences", emoji: "⭐" },
    { label: "Food",        emoji: "🍽️" },
    { label: "Shopping",    emoji: "🛍️" },
];

const LOCATIONS = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Chennai", "Jaipur", "Goa", "Udaipur", "Manali"];
const SORT_OPTIONS = ["Most Popular", "Most Recent", "Most Liked", "Most Viewed"];

export default function TopPicksFilter() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
    const [location, setLocation] = useState("All Cities");
    const [sort, setSort] = useState("Most Popular");

    const toggleCategory = (label: string) =>
        setActiveCategories((prev) => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });

    const activeCount = activeCategories.size + (location !== "All Cities" ? 1 : 0) + (sort !== "Most Popular" ? 1 : 0);

    const clearAll = () => {
        setActiveCategories(new Set());
        setLocation("All Cities");
        setSort("Most Popular");
        setSearch("");
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Filter Collections</h2>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={FilterHorizontalIcon} size={16} strokeWidth={1.8} className="text-gray-400 hidden xl:block" />
                    <button
                        onClick={() => setOpen((p) => !p)}
                        className="xl:hidden flex items-center gap-1.5 text-xs font-semibold text-purple-600 border border-purple-200 bg-purple-50 rounded-full px-3 py-1 hover:bg-purple-100 transition-colors"
                    >
                        <HugeiconsIcon icon={FilterHorizontalIcon} size={12} strokeWidth={2} />
                        {open ? "Hide" : `Filters${activeCount > 0 ? ` (${activeCount})` : ""}`}
                    </button>
                </div>
            </div>

            <div className={`flex-col gap-4 ${open ? "flex" : "hidden"} xl:flex`}>

                {/* Search */}
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                    <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
                    />
                </div>

                {/* Category */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.label}
                                onClick={() => toggleCategory(c.label)}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                    activeCategories.has(c.label)
                                        ? "bg-purple-100 text-purple-700 border-purple-300"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <span>{c.emoji}</span>{c.label}
                            </button>
                        ))}
                    </div>
                    <button className="mt-1.5 text-xs text-purple-600 font-medium hover:underline">View more ↓</button>
                </div>

                {/* Location */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Location</p>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all"
                    >
                        {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                </div>

                {/* Sort by */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all"
                    >
                        {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>

                {/* Clear */}
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                        Clear Filters
                    </button>
                )}

            </div>
        </div>
    );
}
