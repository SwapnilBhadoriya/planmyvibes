"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    StarIcon,
    Location01Icon,
    Add01Icon,
} from "@hugeicons/core-free-icons";
import type { PlaceItem } from "@/components/toppick-detail/types";

interface Props {
    place: PlaceItem;
}

export default function PlaceHero({ place }: Props) {
    return (
        <div className="px-3 sm:px-6 pt-4 sm:pt-5">
            <div className="relative w-full h-[340px] sm:h-[360px] rounded-2xl overflow-hidden">
                <Image src="/images/blogs-hero.png" alt={place.name} fill className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />


                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-5 flex items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Badge */}
                        <span className="inline-block bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded mb-2">
                            {place.category}
                        </span>
                        <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-1.5">
                            {place.name}
                        </h1>
                        <p className="text-white/70 text-xs leading-relaxed line-clamp-2 max-w-lg mb-2">{place.description}</p>
                        {/* Rating + location */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1">
                                <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-400" strokeWidth={1.8} />
                                <span className="text-white text-sm font-semibold">{place.rating}</span>
                                <span className="text-white/70 text-xs">({place.reviewCount} Reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/80 text-xs">
                                <HugeiconsIcon icon={Location01Icon} size={13} className="text-white/70" strokeWidth={1.8} />
                                {place.location}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Info card — bottom right on desktop */}
                <div className="hidden xl:block absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 w-52">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={StarIcon} size={15} className="text-orange-400" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Best Time to Visit</p>
                                <p className="text-sm font-semibold text-gray-800">{place.bestTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} className="text-green-500 rotate-180" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Time to Visit</p>
                                <p className="text-sm font-semibold text-gray-800">{place.timeToVisit}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={Add01Icon} size={15} className="text-blue-500" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Entry Fee</p>
                                <p className="text-sm font-semibold text-gray-800">{place.entryFee}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={Location01Icon} size={15} className="text-purple-500" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Ideal for</p>
                                <p className="text-sm font-semibold text-gray-800">{place.idealFor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={StarIcon} size={15} className="text-yellow-400" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">{place.rating}</p>
                                <p className="text-sm font-semibold text-gray-800">({place.reviewCount} Reviews)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
