"use client";

import { useState, useMemo } from "react";
import { use } from "react";
import TopPickHero from "@/components/toppick-detail/TopPickHero";
import TopPickFilters from "@/components/toppick-detail/TopPickFilters";
import PlaceCard from "@/components/toppick-detail/PlaceCard";
import AboutSidebar from "@/components/toppick-detail/AboutSidebar";
import { MOCK_COLLECTIONS } from "@/components/toppick-detail/mock-data";

interface Props {
    params: Promise<{ id: string }>;
}

export default function TopPickDetailPage({ params }: Props) {
    const { id } = use(params);
    const collection = MOCK_COLLECTIONS[id] ?? MOCK_COLLECTIONS["1"];

    const [activeCategory, setActiveCategory] = useState("all");

    const filteredPlaces = useMemo(() => {
        if (activeCategory === "all") return collection.places;
        return collection.places.filter(
            (p) =>
                p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
                p.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase())
        );
    }, [collection.places, activeCategory]);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopPickHero collection={collection} />

            {/* Main body — extra horizontal padding so cards sit inset like the hero image */}
            <div className="px-4 sm:px-12 lg:px-20 py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 sm:gap-6 items-start">
                {/* Left: filters + places list */}
                <div>
                    <TopPickFilters
                        categories={collection.categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        total={collection.places.length}
                    />

                    <div className="flex flex-col gap-3 sm:gap-4 mt-4">
                        {filteredPlaces.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-sm">
                                No places found in this category.
                            </div>
                        ) : (
                            filteredPlaces.map((place, i) => (
                                <PlaceCard key={place.id} place={place} index={i + 1} />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar — shown below list on mobile, sticky on lg+ */}
                <aside className="lg:sticky lg:top-20 flex flex-col gap-4">
                    <AboutSidebar collection={collection} />
                </aside>
            </div>
        </div>
    );
}
