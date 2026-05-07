"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import ItineraryCard, { type ItinBadgeType, type ItinTagType } from "./ItineraryCard";

type Itinerary = {
    badge: string;
    badgeType: ItinBadgeType;
    title: string;
    subtitle: string;
    days: number;
    nights: number;
    price: string;
    tags: ItinTagType[];
    rating: number;
    reviewCount: number;
    gradient: string;
};

const ITINERARIES: Itinerary[] = [
    {
        badge: "Trending",
        badgeType: "trending",
        title: "Goa Beach Escape",
        subtitle: "Sun, sand & good vibes",
        days: 4, nights: 3,
        price: "₹12,999",
        tags: ["Beach", "Relaxing"],
        rating: 4.8, reviewCount: 120,
        gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    },
    {
        badge: "Top Rated",
        badgeType: "top-rated",
        title: "Swiss Alps Adventure",
        subtitle: "Hike, explore & breathe",
        days: 6, nights: 5,
        price: "₹75,999",
        tags: ["Mountains", "Adventure"],
        rating: 4.9, reviewCount: 98,
        gradient: "from-sky-300 via-blue-500 to-indigo-700",
    },
    {
        badge: "Popular",
        badgeType: "popular",
        title: "Santorini Getaway",
        subtitle: "Romantic views & sunrises",
        days: 5, nights: 4,
        price: "₹60,999",
        tags: ["Romantic", "Relaxing"],
        rating: 4.7, reviewCount: 76,
        gradient: "from-blue-400 via-indigo-500 to-purple-700",
    },
    {
        badge: "Culture",
        badgeType: "culture",
        title: "Rajasthan Heritage Trail",
        subtitle: "Palaces, forts & culture",
        days: 7, nights: 6,
        price: "₹18,999",
        tags: ["Culture", "History"],
        rating: 4.6, reviewCount: 64,
        gradient: "from-orange-400 via-rose-500 to-pink-700",
    },
    {
        badge: "Hidden Gem",
        badgeType: "hidden-gem",
        title: "Kashmir Valley Trek",
        subtitle: "Meadows, peaks & silence",
        days: 5, nights: 4,
        price: "₹25,000",
        tags: ["Mountains", "Adventure"],
        rating: 4.8, reviewCount: 88,
        gradient: "from-teal-400 via-cyan-500 to-blue-700",
    },
    {
        badge: "Budget Pick",
        badgeType: "budget-pick",
        title: "Kerala Backwaters",
        subtitle: "Houseboat life & coconut groves",
        days: 4, nights: 3,
        price: "₹9,500",
        tags: ["Nature", "Relaxing"],
        rating: 4.5, reviewCount: 142,
        gradient: "from-green-400 via-emerald-500 to-teal-700",
    },
    {
        badge: "New",
        badgeType: "new",
        title: "Ladakh Road Trip",
        subtitle: "High-altitude thrills & starlit nights",
        days: 8, nights: 7,
        price: "₹45,000",
        tags: ["Adventure", "Culture"],
        rating: 4.9, reviewCount: 32,
        gradient: "from-slate-400 via-gray-500 to-zinc-700",
    },
    {
        badge: "Family Friendly",
        badgeType: "family-friendly",
        title: "Maldives Escape",
        subtitle: "Overwater bliss & crystal waters",
        days: 5, nights: 4,
        price: "₹1,20,000",
        tags: ["Beach", "Luxury"],
        rating: 4.7, reviewCount: 56,
        gradient: "from-cyan-300 via-blue-400 to-teal-700",
    },
];

const ACTIVE_CHIPS = [
    { label: "🏖️ Beach", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "⏱ 3–5 Days", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { label: "💰 Budget", color: "bg-purple-50 text-purple-600 border-purple-200" },
];

export default function ItinerariesGrid() {
    const [chips, setChips] = useState(ACTIVE_CHIPS);
    const [gridView, setGridView] = useState(true);

    const removeChip = (label: string) =>
        setChips((prev) => prev.filter((c) => c.label !== label));

    return (
        <section>
            {/* Heading row */}
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    ✨ All Itineraries
                </h2>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5">
                    245
                </span>
            </div>

            {/* Active filters bar */}
            <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-gray-100">

                {/* Sort */}
                <button className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-600 transition-colors shrink-0 shadow-sm">
                    Recommended
                    <span className="text-gray-400 text-[10px]">▾</span>
                </button>

                {/* All Filters */}
                <button className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors shrink-0 shadow-sm">
                    <HugeiconsIcon icon={FilterHorizontalIcon} size={13} strokeWidth={2} />
                    All Filters
                </button>

                {/* Active chips */}
                {chips.map((chip) => (
                    <span
                        key={chip.label}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${chip.color}`}
                    >
                        {chip.label}
                        <button
                            onClick={() => removeChip(chip.label)}
                            className="ml-0.5 text-sm leading-none hover:opacity-60 transition-opacity font-bold"
                        >
                            ×
                        </button>
                    </span>
                ))}

                {chips.length > 0 && (
                    <button
                        onClick={() => setChips([])}
                        className="text-xs text-rose-500 font-medium hover:underline shrink-0"
                    >
                        Clear all
                    </button>
                )}

                {/* Right side: count + view toggle */}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">
                        Showing 1–{ITINERARIES.length} of 245
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => setGridView(true)}
                            className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${gridView ? "bg-purple-600 text-white" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                            title="Grid view"
                        >
                            ⊞
                        </button>
                        <button
                            onClick={() => setGridView(false)}
                            className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${!gridView ? "bg-purple-600 text-white" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                            title="List view"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ITINERARIES.map((it) => (
                    <ItineraryCard key={it.title} {...it} />
                ))}
            </div>
        </section>
    );
}
