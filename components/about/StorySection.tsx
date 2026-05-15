import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    SmileIcon,
    FlashIcon,
    NoteIcon,
    HeartAddIcon,
} from "@hugeicons/core-free-icons";

const DIFF_ITEMS = [
    {
        icon: SmileIcon,
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        title: "Curated with Care",
        desc: "Every itinerary is researched, experienced and crafted with love.",
    },
    {
        icon: FlashIcon,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
        title: "Vibe Based",
        desc: "We design trips around vibes, moods and travel styles, not just places.",
    },
    {
        icon: NoteIcon,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Practical & Detailed",
        desc: "From budgets to tips, we cover everything you need to travel stress-free.",
    },
    {
        icon: HeartAddIcon,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-500",
        title: "Real & Honest",
        desc: "No sugarcoating. Just real advice from real travel experiences.",
    },
];

export default function StorySection() {
    return (
        <div className="mx-3 sm:mx-4 xl:mx-6 bg-white border border-gray-100 rounded-2xl mt-4 p-5 sm:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">

            {/* Our Story */}
            <div className="flex flex-col sm:flex-row gap-5 xl:border-r xl:border-gray-100 xl:pr-10">
                <Image
                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&q=80"
                    alt="Campfire at night"
                    width={300}
                    height={300}
                    className="w-full sm:w-32 h-40 sm:h-40 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-2.5">
                    <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Our Story</p>
                    <h2 className="text-lg font-extrabold text-gray-900 leading-snug">
                        Born from a love for travel and good vibes
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        TripVibee started with a simple idea — travel should be easy to plan, fun to experience and impossible to forget. After countless trips, notes and shared itineraries with friends, we knew it was time to create a space where real travelers could find real inspiration.
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        What began as a Google Doc shared between two friends planning a road trip through Rajasthan turned into something much bigger. We realized that most travel platforms felt cold, generic and overwhelming. We wanted something that felt like advice from a friend who truly gets your vibe.
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Today, TripVibee is a growing community of explorers, storytellers and dreamers. Whether you're chasing sunsets in Goa, hunting for hidden temples in Varanasi or planning your first solo adventure, we're here to make every trip feel effortless and unforgettable.
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Every guide we write, every itinerary we curate and every destination we feature is backed by real experience — not press trips or paid placements. Just honest, heartfelt travel content made by people who live and breathe this stuff.
                    </p>
                </div>
            </div>

            {/* What Makes Us Different */}
            <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-5 text-center xl:text-left">What Makes Us Different</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {DIFF_ITEMS.map((item) => (
                        <div key={item.title} className="flex flex-col gap-1.5">
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg} mb-1`}>
                                <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} className={item.iconColor} />
                            </span>
                            <p className="text-sm font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
