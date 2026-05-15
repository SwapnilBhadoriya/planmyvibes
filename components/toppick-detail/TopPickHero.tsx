"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Location01Icon,
    Clock01Icon,
    StarIcon,
    FavouriteIcon,
} from "@hugeicons/core-free-icons";
import type { TopPickCollection } from "./types";

interface Props {
    collection: TopPickCollection;
}

export default function TopPickHero({ collection }: Props) {
    return (
        <div className="px-3 sm:px-6 pt-4 sm:pt-5">

            {/* ── Mobile (< sm): content inside image, stacked layout ── */}
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden max-sm:block hidden">
                <Image src="/images/hero2.png" alt={collection.title} fill className="object-cover object-top" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 pointer-events-none" />
                <span className="absolute top-5 left-5 bg-purple-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded">
                    {collection.badge}
                </span>
                <div className="absolute inset-x-0 bottom-0 px-5 pb-5 flex flex-col gap-2.5">
                    <h1 className="text-white text-2xl font-extrabold leading-tight">{collection.title}</h1>
                    <p className="text-white/75 text-sm">{collection.description}</p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {collection.authors.map((a, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-purple-400 border-2 border-white overflow-hidden">
                                    <Image src={a.avatar} alt={a.name} width={24} height={24} className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/80 text-xs">By {collection.teamLabel} &bull; Updated {collection.updatedDate}</span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Location01Icon} size={13} className="text-purple-500" strokeWidth={1.8} />
                            <div>
                                <div className="font-semibold text-gray-900 text-xs">{collection.placeCount}</div>
                                <div className="text-gray-400 text-[10px]">Places</div>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Clock01Icon} size={13} className="text-green-500" strokeWidth={1.8} />
                            <div>
                                <div className="font-semibold text-gray-900 text-xs">{collection.suggestedDuration}</div>
                                <div className="text-gray-400 text-[10px]">Suggested</div>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={StarIcon} size={13} className="text-yellow-400" strokeWidth={1.8} />
                            <div>
                                <div className="font-semibold text-gray-900 text-xs">{collection.rating}</div>
                                <div className="text-gray-400 text-[10px]">Reviews</div>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={FavouriteIcon} size={13} className="text-red-400" strokeWidth={1.8} />
                            <div>
                                <div className="font-semibold text-gray-900 text-xs">{collection.savedCount}</div>
                                <div className="text-gray-400 text-[10px]">Saved</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── iPad (sm to md): image on top, content + stats below outside image ── */}
            {/* ── iPad / tablet (sm → lg): title top of image, rest at bottom ── */}
            <div className="sm:max-lg:block hidden relative w-full h-[420px] rounded-2xl overflow-hidden">
                <Image src="/images/hero2.png" alt={collection.title} fill className="object-cover object-top" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />
                {/* Single flex column spanning full height */}
                <div className="absolute inset-0 px-5 py-5 flex flex-col justify-between">
                    {/* Top: badge only */}
                    <span className="inline-block self-start bg-purple-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded">
                        {collection.badge}
                    </span>
                    {/* Bottom: title + desc + authors + stats */}
                    <div className="flex flex-col gap-2.5">
                    <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight">{collection.title}</h1>
                    <p className="text-white/80 text-sm">{collection.description}</p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {collection.authors.map((a, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-purple-400 border-2 border-white overflow-hidden">
                                    <Image src={a.avatar} alt={a.name} width={24} height={24} className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/80 text-xs">By {collection.teamLabel} &bull; Updated {collection.updatedDate}</span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Location01Icon} size={14} className="text-purple-500" strokeWidth={1.8} />
                            <div><div className="font-semibold text-gray-900 text-xs">{collection.placeCount}</div><div className="text-gray-400 text-[10px]">Places</div></div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Clock01Icon} size={14} className="text-green-500" strokeWidth={1.8} />
                            <div><div className="font-semibold text-gray-900 text-xs">{collection.suggestedDuration}</div><div className="text-gray-400 text-[10px]">Suggested</div></div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-400" strokeWidth={1.8} />
                            <div><div className="font-semibold text-gray-900 text-xs">{collection.rating}</div><div className="text-gray-400 text-[10px]">Reviews</div></div>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={FavouriteIcon} size={14} className="text-red-400" strokeWidth={1.8} />
                            <div><div className="font-semibold text-gray-900 text-xs">{collection.savedCount}</div><div className="text-gray-400 text-[10px]">Saved</div></div>
                        </div>
                    </div>
                    </div> {/* end bottom flex-col */}
                </div> {/* end justify-between */}
            </div> {/* end iPad image wrapper */}

            {/* ── Desktop (md+): single image with overlaid content ── */}
            <div className="lg:block hidden relative w-full h-[420px] lg:h-[380px] rounded-2xl overflow-hidden">
                <Image src="/images/hero2.png" alt={collection.title} fill className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute top-6 left-7">
                    <span className="bg-purple-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded">
                        {collection.badge}
                    </span>
                </div>
                <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-end px-7 pb-7">
                    <h1 className="text-white text-4xl lg:text-5xl font-extrabold leading-[1.15] mb-3">{collection.title}</h1>
                    <p className="text-white/75 text-sm mb-5">{collection.description}</p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {collection.authors.map((a, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white overflow-hidden">
                                    <Image src={a.avatar} alt={a.name} width={28} height={28} className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/85 text-sm">By {collection.teamLabel} &bull; Updated {collection.updatedDate}</span>
                    </div>
                </div>
                <div className="absolute bottom-7 right-7 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-5 py-3 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Location01Icon} size={15} className="text-purple-500" strokeWidth={1.8} />
                        <div><div className="font-semibold text-gray-900 text-sm">{collection.placeCount}</div><div className="text-gray-500 text-xs">Places</div></div>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Clock01Icon} size={15} className="text-green-500" strokeWidth={1.8} />
                        <div><div className="font-semibold text-gray-900 text-sm">{collection.suggestedDuration}</div><div className="text-gray-500 text-xs">Suggested</div></div>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={StarIcon} size={15} className="text-yellow-400" strokeWidth={1.8} />
                        <div><div className="font-semibold text-gray-900 text-sm">{collection.rating}</div><div className="text-gray-500 text-xs">({collection.reviewCount} Reviews)</div></div>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={FavouriteIcon} size={15} className="text-red-400" strokeWidth={1.8} />
                        <div><div className="font-semibold text-gray-900 text-sm">{collection.savedCount}</div><div className="text-gray-500 text-xs">Saved</div></div>
                    </div>
                </div>
            </div>

        </div>
    );
}
