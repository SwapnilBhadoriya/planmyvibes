"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, ArrowLeft01Icon, Search01Icon } from "@hugeicons/core-free-icons";

const SUGGESTIONS = [
    { label: "Destinations", href: "/destinations" },
    { label: "Itineraries", href: "/itineraries" },
    { label: "Top Picks", href: "/top-picks" },
    { label: "Blog", href: "/blog" },
];

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">

            {/* Floating card */}
            <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl px-8 py-12 flex flex-col items-center text-center">

                {/* Big illustrated number */}
                <div className="relative mb-6 select-none">
                    <span className="text-[120px] sm:text-[140px] font-extrabold leading-none text-gray-100 tracking-tighter">
                        404
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl">
                        ✈️
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                    Looks like you&apos;re lost
                </h1>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs">
                    This page took a detour and never came back. Let&apos;s get you back on the right route.
                </p>

                {/* CTA buttons */}
                <div className="flex items-center gap-3 mt-8 flex-wrap justify-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                    >
                        <HugeiconsIcon icon={Home01Icon} size={15} strokeWidth={2} />
                        Back to Home
                    </Link>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-gray-100 mt-10 mb-8" />

                {/* Quick links */}
                <div className="w-full">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
                        <HugeiconsIcon icon={Search01Icon} size={12} strokeWidth={2} />
                        Or explore these pages
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {SUGGESTIONS.map((s) => (
                            <Link
                                key={s.href}
                                href={s.href}
                                className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 text-sm font-medium text-gray-700 hover:text-purple-600 transition-all"
                            >
                                {s.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom tagline */}
            <p className="mt-8 text-xs text-gray-400">
                TripVibee<span className="text-purple-500 font-bold">+</span> · Plan your vibe, not just your trip.
            </p>
        </main>
    );
}
