import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, HeartAddIcon, StarIcon, Backpack01Icon } from "@hugeicons/core-free-icons";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: "400",
});

const STATS = [
    { icon: GlobeIcon, color: "text-indigo-500", value: "500+", label: "Destinations" },
    { icon: HeartAddIcon, color: "text-pink-500", value: "Curated", label: "with love" },
    { icon: StarIcon, color: "text-green-500", value: "Real", label: "experiences from travelers" },
    { icon: Backpack01Icon, color: "text-yellow-500", value: "For every", label: "kind of traveler" },
];

export default function DestinationsHero() {
    return (
        <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl min-h-[260px] sm:min-h-[320px] xl:min-h-[300px]">

            {/* Mobile / tablet image (destinations-hero-2) — below xl */}
            <Image
                src="/images/destinations-hero-2.png"
                alt="Destinations hero"
                fill
                priority
                className="object-cover object-center block xl:hidden"
            />

            {/* Desktop image (destinations-hero) — xl and above */}
            <Image
                src="/images/destinations-hero.png"
                alt="Destinations hero"
                fill
                priority
                className="object-cover object-center hidden xl:block"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35 xl:bg-white/10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 px-5 sm:px-8 xl:px-16 pt-7 sm:pt-10 pb-10 sm:pb-16 xl:pb-28 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 xl:gap-10 items-end min-h-[240px] sm:min-h-[300px] xl:min-h-[380px]">

                {/* Left — text */}
                <div className="flex flex-col gap-2 sm:gap-3 max-w-xl">

                    <span className="inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white">
                        Explore the World
                    </span>

                    <h1 className={`text-3xl sm:text-4xl xl:text-5xl text-white font-extrabold leading-tight ${pacifico.className}`}>
                        Find your next<br />
                        <span className="text-purple-300 font-normal">
                            happy place
                        </span>
                        <span className="text-pink-400 ml-2 text-2xl sm:text-3xl">✦</span>
                    </h1>

                    <p className="text-xs sm:text-sm mt-1 sm:mt-2 max-w-md leading-relaxed text-white/80">
                        From serene beaches to thrilling mountains, explore destinations
                        that match your vibe and fuel your wanderlust.
                    </p>
                </div>

                {/* Stats bar — desktop only */}
                <div className="hidden xl:flex items-stretch bg-white rounded-2xl shadow-lg overflow-hidden divide-x divide-gray-100 self-end">
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
                <div className="flex xl:hidden flex-wrap gap-2 self-end">
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
