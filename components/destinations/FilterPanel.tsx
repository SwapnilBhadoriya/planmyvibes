"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";

const VIBES = [
    { label: "Beach", emoji: "🏖️", active: "bg-blue-100 text-blue-600 border-blue-200" },
    { label: "Mountains", emoji: "🏔️", active: "bg-green-100 text-green-600 border-green-200" },
    { label: "Adventure", emoji: "🔥", active: "bg-orange-100 text-orange-600 border-orange-200" },
    { label: "Culture", emoji: "🏛️", active: "bg-purple-100 text-purple-600 border-purple-200" },
    { label: "Relaxing", emoji: "💆", active: "bg-pink-100 text-pink-600 border-pink-200" },
];

const BUDGETS = ["Budget (Under ₹10K)", "Mid-range (₹10K – ₹30K)", "Luxury (₹30K+)"];
const DURATIONS = ["Weekend Getaway", "3 – 5 Days", "5+ Days"];

export default function FilterPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeVibes, setActiveVibes] = useState<Set<string>>(new Set());
    const [budget, setBudget] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);

    const toggleVibe = (label: string) =>
        setActiveVibes((prev) => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });

    const activeCount = activeVibes.size + (budget ? 1 : 0) + (duration ? 1 : 0);

    return (
        <div className="flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Filter Destinations</h2>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={FilterHorizontalIcon} size={18} strokeWidth={1.8} className="text-gray-400 hidden lg:block" />
                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen((p) => !p)}
                        className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-purple-600 border border-purple-200 bg-purple-50 rounded-full px-3 py-1 transition-colors hover:bg-purple-100"
                    >
                        <HugeiconsIcon icon={FilterHorizontalIcon} size={13} strokeWidth={2} />
                        {isOpen ? "Hide" : `Filters${activeCount > 0 ? ` (${activeCount})` : ""}`}
                    </button>
                </div>
            </div>

            {/* Filter body — always visible on lg, toggled on mobile */}
            <div className={`flex-col gap-5 ${isOpen ? "flex" : "hidden"} lg:flex`}>

                {/* Search */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Search destination</p>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                        <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Where do you want to go?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
                        />
                    </div>
                </div>

                {/* Vibe */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Vibe</p>
                    <div className="flex flex-wrap gap-2">
                        {VIBES.map((v) => (
                            <button
                                key={v.label}
                                onClick={() => toggleVibe(v.label)}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                    activeVibes.has(v.label)
                                        ? v.active
                                        : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <span>{v.emoji}</span>
                                {v.label}
                            </button>
                        ))}
                    </div>
                    <button className="mt-2 text-xs text-purple-600 font-medium hover:underline">View more ↓</button>
                </div>

                {/* Budget */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Budget</p>
                    <div className="flex flex-col gap-2">
                        {BUDGETS.map((b) => (
                            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={budget === b}
                                    onChange={() => setBudget(budget === b ? null : b)}
                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 accent-purple-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Trip Duration */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Trip Duration</p>
                    <div className="flex flex-col gap-2">
                        {DURATIONS.map((d) => (
                            <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={duration === d}
                                    onChange={() => setDuration(duration === d ? null : d)}
                                    className="h-4 w-4 rounded border-gray-300 accent-purple-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{d}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
