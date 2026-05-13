import Image from "next/image";
import { Dancing_Script } from "next/font/google";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiamondIcon, HeartAddIcon, StarIcon, UserGroupIcon } from "@hugeicons/core-free-icons";

const dancing = Dancing_Script({ subsets: ["latin"], weight: ["600", "700"] });

const STATS = [
    { icon: DiamondIcon,   color: "text-purple-500", value: "200+",  label: "Collections" },
    { icon: HeartAddIcon,  color: "text-pink-500",   value: "Curated", label: "with love" },
    { icon: StarIcon,      color: "text-green-500",  value: "Expert", label: "selections" },
    { icon: UserGroupIcon, color: "text-orange-400", value: "50K+",  label: "Happy travelers" },
];

export default function TopPicksHero() {
    return (
        <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl min-h-[260px] sm:min-h-[320px] xl:min-h-[300px]">

            {/* Hero image */}
            <Image
                src="/images/toppicks-hero.png"
                alt="Top Picks hero"
                fill
                priority
                className="object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 px-5 sm:px-8 xl:px-16 pt-7 sm:pt-10 pb-10 sm:pb-16 xl:pb-28 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 xl:gap-10 min-h-[240px] sm:min-h-[300px] xl:min-h-[380px]">

                {/* Left — text */}
                <div className="flex flex-col gap-2 sm:gap-3 max-w-xl">
                    <span className="inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">
                        Curated Collections
                    </span>

                    <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight">
                        Handpicked collections
                        <br />
                        <span className={`${dancing.className} text-purple-300 font-semibold text-4xl sm:text-5xl xl:text-6xl`}>
                            for every traveler ✦
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-md mt-1">
                        Explore the best places, cafes, experiences and more, carefully curated for every kind of traveler.
                    </p>
                </div>

                {/* Stats bar — desktop: inline, mobile: pills */}
                <div className="hidden xl:flex items-stretch bg-white rounded-2xl shadow-lg overflow-hidden divide-x divide-gray-100 self-end">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex items-center gap-2.5 px-5 py-4">
                            <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.8} className={s.color} />
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile/tablet pills */}
                <div className="flex xl:hidden flex-wrap gap-2">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <HugeiconsIcon icon={s.icon} size={13} strokeWidth={1.8} className={s.color} />
                            <span className="text-xs font-semibold text-gray-800">{s.value} {s.label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
