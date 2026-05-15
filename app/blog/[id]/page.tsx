"use client";

import Image from "next/image";
import Link from "next/link";
import { Kalam } from "next/font/google";

const kalam = Kalam({ subsets: ["latin"], weight: ["700"] });
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Bookmark01Icon,
    Share01Icon,
    CheckmarkCircle01Icon,
    ArrowRight01Icon,
    Sun01Icon,
} from "@hugeicons/core-free-icons";
import RelatedPosts from "@/components/shared/RelatedPosts";

const relatedPosts = [
    { title: "Top 10 Beaches in India You Must Visit", readTime: "6 min read", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" },
    { title: "Goa vs Bali: Which Island Destination is Right for You?", readTime: "7 min read", image: "https://images.unsplash.com/photo-1548013441-c3b5c5e5f29a?w=200&q=80" },
    { title: "A Complete Travel Guide to South Goa", readTime: "5 min read", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80" },
    { title: "10 Things to Do in Goa Beyond Beaches", readTime: "6 min read", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&q=80" },
];


export default function BlogDetailPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="px-4 sm:px-10 lg:px-16 pt-5 pb-3">
                <nav className="flex items-center gap-2 text-xs text-gray-400">
                    <Link href="/" className="hover:text-gray-600">Home</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-gray-600">Blog</Link>
                    <span>/</span>
                    <span className="text-gray-600">Best Time to Visit Goa</span>
                </nav>
            </div>

            <div className="px-4 sm:px-10 lg:px-16 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

                {/* Main content */}
                <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">

                    {/* Category badge + actions */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Destinations</span>
                        <div className="flex items-center gap-3 shrink-0">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <HugeiconsIcon icon={Bookmark01Icon} size={20} strokeWidth={1.8} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <HugeiconsIcon icon={Share01Icon} size={20} strokeWidth={1.8} />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className={`text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-4 ${kalam.className}`}>
                        Best Time to Visit Goa{" "}
                        <span className="relative inline-block">
                            for the Perfect Getaway
                            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                                <path d="M0 5 Q75 0 150 4 Q225 8 300 3" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
                            </svg>
                        </span>{" "}✨
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        From sunny beaches to vibrant nightlife, Goa is a year-round destination. Here&apos;s a seasonal guide to help you plan your perfect trip.
                    </p>

                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                            <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Author" fill className="object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-gray-800">By TripVibee</span>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#6366F1"/><path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>May 20, 2024</span>
                                <span>•</span>
                                <span>8 min read</span>
                                <span>•</span>
                                <span>👁 12.4K views</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-6">
                        <Image
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"
                            alt="Goa beach at sunset"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Intro paragraph */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Goa is one of India&apos;s most beloved travel destinations, known for its sun-kissed beaches, Portuguese heritage, delicious food, and lively atmosphere. But depending on when you visit, your Goa experience can be completely different.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-8">
                        Here&apos;s a month-by-month breakdown to help you choose the best time for your kind of trip.
                    </p>

                    {/* Section: Peak Season */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={Sun01Icon} size={16} className="text-yellow-500" strokeWidth={1.8} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Peak Season (November to February)</h2>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            This is the most popular time to visit Goa. The weather is pleasant, with clear skies, cool breezes, and temperatures between 20°C to 30°C.
                        </p>

                        {/* Why visit callout */}
                        <div className="flex flex-col sm:flex-row gap-4 bg-purple-50 rounded-2xl p-5">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-purple-700 mb-3">Why visit now?</p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        "Perfect beach weather",
                                        "Ideal for water sports and outdoor activities",
                                        "Vibrant nightlife and festivals (Sunburn, Christmas, New Year)",
                                        "Best time for sightseeing and island trips",
                                    ].map((tip) => (
                                        <div key={tip} className="flex items-start gap-2">
                                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-purple-500 mt-0.5 shrink-0" strokeWidth={1.8} />
                                            <span className="text-xs text-gray-700">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full sm:w-40 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0">
                                <Image src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&q=80" alt="Peak season" fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Shoulder Season */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={Sun01Icon} size={16} className="text-blue-400" strokeWidth={1.8} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Shoulder Season (March to May)</h2>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            Goa starts heating up, but the beaches are less crowded and prices drop significantly. Great for budget travellers who don&apos;t mind the heat.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 bg-blue-50 rounded-2xl p-5">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-blue-700 mb-3">Why visit now?</p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        "Fewer tourists and cheaper accommodation",
                                        "Good for budget travellers",
                                        "Festivals like Shigmo are celebrated",
                                        "Restaurants and shacks still open",
                                    ].map((tip) => (
                                        <div key={tip} className="flex items-start gap-2">
                                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-blue-500 mt-0.5 shrink-0" strokeWidth={1.8} />
                                            <span className="text-xs text-gray-700">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full sm:w-40 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0">
                                <Image src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80" alt="Shoulder season" fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                </article>

                {/* Sidebar */}
                <aside className="flex flex-col gap-5 lg:sticky lg:top-20">


                    <RelatedPosts posts={relatedPosts} />

                    {/* Top Picks */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-base">Top Picks</h3>
                            <Link href="/top-picks" className="flex items-center gap-0.5 text-xs font-semibold text-purple-600 hover:text-purple-700">
                                View all <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2.5} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { title: "Top 10 Places in Mumbai", count: 10, href: "/top-picks/1" },
                                { title: "Best Beaches in Goa", count: 8, href: "/top-picks/2" },
                                { title: "Hidden Gems of Rajasthan", count: 12, href: "/top-picks/3" },
                                { title: "Must-Visit Temples in Varanasi", count: 7, href: "/top-picks/4" },
                            ].map((pick) => (
                                <Link key={pick.title} href={pick.href} className="flex items-center justify-between group">
                                    <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">{pick.title}</span>
                                    <span className="text-xs text-gray-400 shrink-0 ml-2">{pick.count} places</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="relative rounded-2xl overflow-hidden h-48">
                        <Image src="/images/explore.png" alt="Explore" fill className="object-cover" />
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <Link href="/itineraries" className="inline-flex w-fit items-center gap-1 bg-purple-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-purple-700 transition-colors">
                                Explore Now <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>

                </aside>
            </div>
        </main>
    );
}
