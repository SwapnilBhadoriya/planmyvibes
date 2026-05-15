"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { MOCK_COLLECTIONS } from "@/components/toppick-detail/mock-data";
import PlaceHero from "@/components/place-detail/PlaceHero";
import PlaceAbout from "@/components/place-detail/PlaceAbout";
import PlaceGallery from "@/components/place-detail/PlaceGallery";
import PlaceQuickInfo from "@/components/place-detail/PlaceQuickInfo";
import PlaceLocation from "@/components/place-detail/PlaceLocation";
import PlaceRelatedCollections from "@/components/place-detail/PlaceRelatedCollections";
import PlaceNearby from "@/components/place-detail/PlaceNearby";
import PlaceSidebar from "@/components/place-detail/PlaceSidebar";

interface Props {
    params: Promise<{ id: string; placeId: string }>;
}

export default function PlaceDetailPage({ params }: Props) {
    const { id, placeId } = use(params);
    const collection = MOCK_COLLECTIONS[id];
    const place = collection?.places.find((p) => p.id === Number(placeId));

    if (!place) return notFound();

    return (
        <div className="min-h-screen bg-gray-50">
            <PlaceHero place={place} collectionId={id} collectionTitle={collection.title} />

            <div className="px-4 sm:px-10 lg:px-16 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                    <PlaceAbout place={place} />
                    <PlaceGallery images={place.gallery} />
                    <PlaceQuickInfo place={place} />
                    <PlaceLocation place={place} />
                    <PlaceRelatedCollections collections={place.relatedCollections} />
                    <PlaceNearby places={place.nearbyPlaces} />
                </div>

                {/* Right sidebar */}
                <aside className="lg:sticky lg:top-20 flex flex-col gap-4">
                    <PlaceSidebar place={place} />
                </aside>
            </div>
        </div>
    );
}
