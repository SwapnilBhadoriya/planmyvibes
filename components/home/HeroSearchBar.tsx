"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Calendar01Icon, User02Icon } from "@hugeicons/core-free-icons";

export default function HeroSearchBar() {
    const [destination, setDestination] = useState("");

    return (
        <div className="flex items-center bg-white rounded-full shadow-xl overflow-hidden pr-2 py-2 max-w-2xl">

            {/* Where to */}
            <div className="flex items-center gap-2 px-5 flex-1 min-w-0">
                <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Where to?</p>
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="w-px h-10 bg-gray-200 shrink-0" />

            {/* When */}
            <div className="flex items-center gap-2 px-5 shrink-0">
                <HugeiconsIcon icon={Calendar01Icon} size={18} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">When?</p>
                    <p className="text-sm text-gray-800">Anytime</p>
                </div>
            </div>

            <div className="w-px h-10 bg-gray-200 shrink-0" />

            {/* Travelers */}
            <div className="flex items-center gap-2 px-5 shrink-0">
                <HugeiconsIcon icon={User02Icon} size={18} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Travelers</p>
                    <p className="text-sm text-gray-800">2 Travelers</p>
                </div>
            </div>

            {/* CTA */}
            <button className="ml-2 shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors whitespace-nowrap">
                Explore Itineraries →
            </button>
        </div>
    );
}
