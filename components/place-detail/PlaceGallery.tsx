"use client";

import { useState } from "react";
import Image from "next/image";

interface Props { images: string[] }

export default function PlaceGallery({ images }: Props) {
    const [showAll, setShowAll] = useState(false);

    const preview = images.slice(0, 5);
    const extra = images.length - 5;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Photo Gallery</h2>
                <span className="text-xs text-gray-400">{images.length} photos</span>
            </div>

            {/* Preview: 1 large + 4 small */}
            {!showAll && (
                <div className="flex gap-2">
                    {/* Large rectangle */}
                    <div className="relative rounded-xl overflow-hidden w-2/5 h-96 shrink-0">
                        <Image src={preview[0]} alt="Gallery 1" fill className="object-cover" />
                    </div>
                    {/* 4 squares in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 flex-1 h-96">
                        {preview.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden"
                                onClick={i === 3 && extra > 0 ? () => setShowAll(true) : undefined}
                                style={i === 3 && extra > 0 ? { cursor: "pointer" } : undefined}
                            >
                                <Image src={img} alt={`Gallery ${i + 2}`} fill className="object-cover" />
                                {i === 3 && extra > 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                                        <span className="text-2xl font-bold">+{extra}</span>
                                        <span className="text-xs">Photos</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expanded: all images in a uniform grid */}
            {showAll && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((img, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden h-36">
                            <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            )}

            {/* Toggle button */}
            {images.length > 5 && (
                <button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-4 w-full text-sm font-semibold text-purple-600 border border-purple-200 rounded-xl py-3 hover:bg-purple-50 transition-colors active:bg-purple-100"
                >
                    {showAll ? "Show Less" : `View All ${images.length} Photos`}
                </button>
            )}
        </div>
    );
}
