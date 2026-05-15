"use client";

import Link from "next/link";
import type { PlaceItem } from "./types";

interface Props {
    places: PlaceItem[];
    city: string;
    center: { lat: number; lng: number };
    zoom: number;
}

// Static map embed via OpenStreetMap iframe (no API key needed)
export default function CollectionMap({ places, city, center, zoom }: Props) {
    const bbox = `${center.lng - 0.15},${center.lat - 0.12},${center.lng + 0.15},${center.lat + 0.12}`;
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${center.lat},${center.lng}`;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Collection Map</h3>
                <a
                    href={`https://www.openstreetmap.org/#map=${zoom}/${center.lat}/${center.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                    View full map →
                </a>
            </div>
            <div className="h-48 w-full relative">
                <iframe
                    src={mapSrc}
                    className="w-full h-full border-0"
                    title={`Map of ${city}`}
                    loading="lazy"
                />
            </div>
            {/* Pin list */}
            <div className="px-4 py-3 flex flex-wrap gap-1.5">
                {places.slice(0, 8).map((p, i) => (
                    <span
                        key={p.id}
                        className="flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium"
                    >
                        <span className="w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                        </span>
                        {p.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
