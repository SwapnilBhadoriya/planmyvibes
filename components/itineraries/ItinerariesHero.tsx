import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, HeartAddIcon, StarIcon, Backpack01Icon } from "@hugeicons/core-free-icons";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: "400",
});

const STATS = [
    { icon: GlobeIcon, color: "text-purple-500", value: "1000+", label: "Itineraries" },
    { icon: HeartAddIcon, color: "text-pink-500", value: "Curated", label: "with love" },
    { icon: StarIcon, color: "text-green-500", value: "Expert", label: "planned" },
    { icon: Backpack01Icon, color: "text-yellow-500", value: "For every", label: "traveler" },
];

export default function ItinerariesHero() {
    return (
        <section className="relative overflow-hidden mx-4 lg:mx-6 rounded-3xl min-h-[260px] sm:min-h-[340px] lg:min-h-[300px]">

            {/* Background image */}
            <Image
                src="/images/itineraries-hero.png"
                alt="Itineraries hero"
                fill
                priority
                className="object-cover object-center"
            />

            {/* Gradient overlay — darkens left side so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10 pb-14 sm:pb-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-end min-h-[240px] sm:min-h-[300px] lg:min-h-[380px]">

                {/* Left — text */}
                <div className="flex flex-col gap-2 sm:gap-3 max-w-xl">

                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white">
                        ☀️ Your Journey, Perfectly Planned
                    </span>

                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold leading-tight ${pacifico.className}`}>
                        Itineraries that<br />
                        <span className="text-fuchsia-300 underline decoration-wavy decoration-pink-400 decoration-2 font-normal">
                            match your vibe
                        </span>
                        <span className="text-pink-300 ml-2 text-2xl sm:text-3xl">✦</span>
                    </h1>

                    <p className="text-xs sm:text-sm mt-1 sm:mt-2 max-w-md leading-relaxed text-white/80">
                        Handpicked itineraries crafted for real travelers.
                        Choose your vibe and let the adventure begin!
                    </p>
                </div>

                {/* Stats bar — desktop only */}
                <div className="hidden lg:flex items-stretch bg-white rounded-2xl shadow-lg overflow-hidden divide-x divide-gray-100 self-end">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex items-center gap-2.5 px-5 py-4">
                            <span className={`shrink-0 ${s.color}`}>
                                <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.8} />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats — mobile/tablet: compact pills */}
                <div className="flex lg:hidden flex-wrap gap-2 self-end">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <span className={`shrink-0 ${s.color}`}>
                                <HugeiconsIcon icon={s.icon} size={14} strokeWidth={1.8} />
                            </span>
                            <span className="text-xs font-semibold text-gray-800">{s.value} {s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
