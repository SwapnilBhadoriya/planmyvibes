"use client";

import { useState } from "react";
import DestinationCard, { type DestBadgeColor } from "./DestinationCard";

type Destination = {
    badge: string;
    badgeColor: DestBadgeColor;
    location: string;
    country: string;
    description: string;
    days: number;
    price: string;
    gradient: string;
};

const ALL_DESTINATIONS: Destination[] = [
    { badge: "Trending",    badgeColor: "green",  location: "Bali",          country: "Indonesia",     description: "Beaches, temples & endless vibes",       days: 4,  price: "₹22,000",   gradient: "from-emerald-400 via-teal-500 to-cyan-700" },
    { badge: "Top Rated",   badgeColor: "blue",   location: "Swiss Alps",    country: "Switzerland",   description: "For the mountain lovers",                 days: 6,  price: "₹75,000",   gradient: "from-sky-300 via-blue-500 to-indigo-700" },
    { badge: "Popular",     badgeColor: "purple", location: "Santorini",     country: "Greece",        description: "White houses & blue dreams",              days: 4,  price: "₹60,000",   gradient: "from-blue-400 via-indigo-500 to-purple-700" },
    { badge: "Hidden Gem",  badgeColor: "orange", location: "Banff",         country: "Canada",        description: "Nature at its best",                      days: 5,  price: "₹80,000",   gradient: "from-teal-400 via-cyan-500 to-blue-700" },
    { badge: "Culture",     badgeColor: "indigo", location: "Jaipur",        country: "India",         description: "Royal heritage & vibrant culture",        days: 3,  price: "₹8,500",    gradient: "from-orange-400 via-rose-500 to-pink-700" },
    { badge: "Trending",    badgeColor: "green",  location: "Tokyo",         country: "Japan",         description: "Neon lights & ancient temples",           days: 7,  price: "₹55,000",   gradient: "from-pink-400 via-fuchsia-500 to-purple-700" },
    { badge: "Luxury",      badgeColor: "blue",   location: "Maldives",      country: "Indian Ocean",  description: "Overwater bliss & crystal waters",        days: 5,  price: "₹1,20,000", gradient: "from-cyan-300 via-blue-400 to-teal-700" },
    { badge: "Romantic",    badgeColor: "purple", location: "Amalfi Coast",  country: "Italy",         description: "Cliffs, colours & la dolce vita",         days: 6,  price: "₹68,000",   gradient: "from-yellow-400 via-orange-500 to-rose-600" },
    { badge: "Adventure",   badgeColor: "orange", location: "Patagonia",     country: "Argentina",     description: "Wild trails & untamed landscapes",        days: 8,  price: "₹95,000",   gradient: "from-slate-400 via-gray-600 to-zinc-800" },
    { badge: "Culture",     badgeColor: "indigo", location: "Kyoto",         country: "Japan",         description: "Temples, geishas & autumn leaves",        days: 5,  price: "₹50,000",   gradient: "from-rose-300 via-pink-400 to-fuchsia-600" },
    { badge: "Beach",       badgeColor: "blue",   location: "Goa",           country: "India",         description: "Sun, sand & shacks by the sea",          days: 3,  price: "₹4,000",    gradient: "from-cyan-400 via-teal-500 to-green-700" },
    { badge: "Adventure",   badgeColor: "orange", location: "Manali",        country: "India",         description: "Snow peaks & river valleys",              days: 4,  price: "₹6,500",    gradient: "from-blue-300 via-slate-500 to-slate-800" },
    { badge: "Hidden Gem",  badgeColor: "green",  location: "Tawang",        country: "India",         description: "Monasteries above the clouds",           days: 4,  price: "₹7,500",    gradient: "from-green-600 via-emerald-700 to-slate-800" },
    { badge: "Trending",    badgeColor: "purple", location: "Dubai",         country: "UAE",           description: "Luxury meets desert adventure",           days: 4,  price: "₹40,000",   gradient: "from-yellow-400 via-orange-400 to-red-600" },
    { badge: "Culture",     badgeColor: "indigo", location: "Rome",          country: "Italy",         description: "Ancient history at every corner",         days: 5,  price: "₹55,000",   gradient: "from-amber-400 via-orange-500 to-red-700" },
    { badge: "Beach",       badgeColor: "blue",   location: "Phuket",        country: "Thailand",      description: "Turquoise waters & vibrant nightlife",    days: 5,  price: "₹18,000",   gradient: "from-emerald-400 via-teal-500 to-blue-700" },
    { badge: "Luxury",      badgeColor: "purple", location: "Paris",         country: "France",        description: "The city of love & light",                days: 6,  price: "₹90,000",   gradient: "from-pink-300 via-rose-400 to-fuchsia-600" },
    { badge: "Adventure",   badgeColor: "orange", location: "New Zealand",   country: "NZ",            description: "Fjords, glaciers & Lord of the Rings",   days: 10, price: "₹1,50,000", gradient: "from-green-400 via-emerald-600 to-teal-800" },
    { badge: "Top Rated",   badgeColor: "green",  location: "Barcelona",     country: "Spain",         description: "Gaudí, tapas & beach vibes",             days: 5,  price: "₹65,000",   gradient: "from-yellow-400 via-red-500 to-rose-700" },
    { badge: "Hidden Gem",  badgeColor: "indigo", location: "Leh Ladakh",    country: "India",         description: "High altitude desert & starry skies",    days: 6,  price: "₹12,000",   gradient: "from-slate-400 via-blue-600 to-indigo-900" },
];

const PAGE_SIZE = 8;

export default function PopularDestinationsSection() {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(ALL_DESTINATIONS.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const visible = ALL_DESTINATIONS.slice(start, start + PAGE_SIZE);

    const goTo = (p: number) => {
        setPage(p);
        // Scroll back to top of the section smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    ✨ Destinations
                </h2>
                <span className="text-xs text-gray-400">
                    {start + 1}–{Math.min(start + PAGE_SIZE, ALL_DESTINATIONS.length)} of {ALL_DESTINATIONS.length}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                {visible.map((d) => (
                    <DestinationCard key={d.location} {...d} />
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

                {/* Page numbers */}
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
