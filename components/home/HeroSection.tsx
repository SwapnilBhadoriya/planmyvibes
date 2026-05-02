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
        <section className="relative overflow-hidden mx-4 lg:mx-6 rounded-3xl min-h-[420px]">

            {/* Background image */}
            <Image
                src="/images/hero.png"
                alt="Hero background"
                fill
                priority
                className="object-cover object-center"
            />

            {/* Dark overlay so text stays readable */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Content */}
            <div className="relative z-10 px-10 lg:px-16 pt-10 pb-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-center">

                {/* Left column */}
                <div className="flex flex-col gap-4 max-w-3xl">

                    {/* Badge */}
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-sm font-medium text-gray-700 shadow-sm">
                        ☀️ Your journey begins here
                    </span>

                    {/* Headline */}
                    <h1 className={`text-4xl lg:text-5xl font-bold text-white leading-tight ${pacifico.className}`}>
                        Itineraries that inspire,<br />
                        <em className="not-italic text-purple-400">adventures</em> that stay
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm text-white/70 max-w-md">
                        Curated travel itineraries for every vibe and every kind of traveler.
                    </p>

                    {/* Search bar */}
                    <HeroSearchBar />

                    {/* Category tags */}
                    <HeroCategoryTags />

                </div>

                {/* Right column — Vibe card */}
                <div className="hidden lg:block">
                    <HeroVibeCard />
                </div>

            </div>
        </section>
    );
}
