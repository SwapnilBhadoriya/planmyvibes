import Image from "next/image";
import HeroSearchBar from "./HeroSearchBar";
import HeroCategoryTags from "./HeroCategoryTags";
import HeroVibeCard from "./HeroVibeCard";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: "400",
});

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl min-h-[400px] md:min-h-[460px] xl:min-h-[360px]">

            {/* Mobile image (hero2) — below md */}
            <Image
                src="/images/hero2.png"
                alt="Hero background"
                fill
                priority
                className="object-cover object-center block md:hidden"
            />

            {/* Tablet / iPad Pro image (hero3) — md to xl */}
            <Image
                src="/images/hero3.png"
                alt="Hero background"
                fill
                priority
                className="object-cover object-center hidden md:block xl:hidden"
            />

            {/* Desktop image (hero) — xl and above */}
            <Image
                src="/images/hero.png"
                alt="Hero background"
                fill
                priority
                className="object-cover object-center hidden xl:block"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 md:bg-black/35 xl:bg-black/25 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 px-5 sm:px-8 md:px-10 xl:px-16 pt-8 sm:pt-10 pb-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 xl:gap-10 items-center">

                {/* Left column */}
                <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl">

                    {/* Badge */}
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
                        ☀️ Your journey begins here
                    </span>

                    {/* Headline */}
                    <h1 className={`text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight ${pacifico.className}`}>
                        Itineraries that inspire,<br />
                        <em className="not-italic text-purple-400">adventures</em> that stay
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm text-white/70 max-w-md">
                        Curated travel itineraries for every vibe and every kind of traveler.
                    </p>

                    {/* Search bar */}
                    <HeroSearchBar />

                    {/* Category tags */}
                    <HeroCategoryTags />

                </div>

                {/* Right column — Vibe card (desktop only) */}
                <div className="hidden xl:block">
                    <HeroVibeCard />
                </div>

            </div>
        </section>
    );
}
