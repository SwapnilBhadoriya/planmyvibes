"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    FavouriteIcon,
    Clock01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { PlaceItem } from "./types";

interface Props {
    place: PlaceItem;
    index: number;
}

export default function PlaceCard({ place, index }: Props) {
    const [liked, setLiked] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
            {/* Image with number badge */}
            <div className="relative shrink-0 w-full h-44 sm:w-56 sm:h-auto m-2 rounded-xl overflow-hidden">
                <Image src={place.image} alt={place.name} fill className="object-cover" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-purple-600 text-white text-sm font-bold flex items-center justify-center shadow">
                    {index}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col sm:flex-row px-4 py-4 sm:px-6 sm:py-5">
                {/* Left: category, name, desc, tags */}
                <div className="flex-1 min-w-0 flex flex-col gap-3 pr-0 sm:pr-6">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{place.name}</h3>
                        <p className="text-xs font-medium text-gray-400">{place.category}</p>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {place.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {place.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: rating, best time, time to visit, actions */}
                <div className="hidden sm:flex flex-col items-start shrink-0 w-44 pl-6 border-l border-gray-100">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-6">
                        <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-400" strokeWidth={1.8} />
                        <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                        <span className="text-xs text-gray-400">({place.reviewCount})</span>
                    </div>

                    {/* Best time */}
                    <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-0.5">Best Time</p>
                        <p className="text-sm font-bold text-gray-800">{place.bestTime}</p>
                    </div>

                    {/* Time to visit */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                            <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.8} />
                            Time to Visit
                        </p>
                        <p className="text-sm font-bold text-gray-800">{place.timeToVisit}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link href={`/place/${place.id}`} className="flex items-center gap-1.5 border border-purple-500 text-purple-600 hover:bg-purple-50 text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                            View Details
                            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2.5} />
                        </Link>
                        <button
                            onClick={() => setLiked((v) => !v)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-red-300 transition-colors"
                        >
                            <HugeiconsIcon
                                icon={FavouriteIcon}
                                size={14}
                                className={liked ? "text-red-500" : "text-gray-400"}
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile bottom row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 sm:hidden">
                    <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={StarIcon} size={13} className="text-yellow-400" strokeWidth={1.8} />
                        <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                        <span className="text-xs text-gray-400">({place.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.8} />
                        {place.timeToVisit}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/place/${place.id}`} className="flex items-center gap-1 border border-purple-500 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                            Details
                            <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2.5} />
                        </Link>
                        <button onClick={() => setLiked((v) => !v)} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200">
                            <HugeiconsIcon icon={FavouriteIcon} size={13} className={liked ? "text-red-500" : "text-gray-400"} strokeWidth={1.8} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
