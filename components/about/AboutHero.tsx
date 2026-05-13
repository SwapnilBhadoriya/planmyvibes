import Image from "next/image";
import { Dancing_Script, Pacifico } from "next/font/google";

const dancing = Dancing_Script({ subsets: ["latin"], weight: ["600", "700"] });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function AboutHero() {
    return (
        <section className="relative overflow-hidden bg-[#FAFAF8] mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl mt-4">

            {/* Dot grid decoration */}
            <svg className="absolute top-4 right-4 opacity-20 pointer-events-none" width="80" height="80" viewBox="0 0 80 80">
                <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#7C3AED" />
                </pattern>
                <rect width="80" height="80" fill="url(#dots)" />
            </svg>

            {/* Decorations around the images on the right */}
            <div className="hidden xl:block absolute top-6 right-52 text-red-400 text-xl pointer-events-none">♥</div>
            <div className="hidden xl:block absolute bottom-8 right-48 text-2xl pointer-events-none">🌿</div>
            <div className="hidden xl:block absolute top-8 right-96 text-3xl pointer-events-none">☀️</div>
            <div className="hidden xl:block absolute top-20 right-80 w-16 h-16 border-2 border-dashed border-purple-300 rounded-full opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-10 px-5 sm:px-8 xl:px-12 py-8 xl:py-10">

                {/* Left — text, stretched to fill space */}
                <div className="flex flex-col gap-4 text-center xl:text-left items-center xl:items-start order-1 xl:order-1 xl:flex-1 xl:max-w-[520px]">
                    <span className="inline-block bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                        About Us
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                        We're here to inspire your{" "}
                        <span className={`${dancing.className} text-purple-600 text-4xl sm:text-5xl`}>
                            next adventure.
                        </span>
                    </h1>

                    <p className="text-sm text-gray-500 leading-relaxed xl:max-w-lg">
                        TripVibee is a travel inspiration platform built for dreamers, explorers and experience seekers. We create and curate detailed, authentic itineraries — from hidden mountain trails to sun-soaked beach escapes — to help you travel better, spend smarter and make memories that last a lifetime. Whether you're a solo wanderer or planning a group adventure, we've got the vibe for you.
                    </p>

                    <a href="#contact" className={`${dancing.className} inline-flex items-center gap-2 text-xl font-semibold text-gray-900 hover:text-purple-600 transition-colors`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Let's vibee!
                    </a>
                </div>

                {/* Images — pushed to right (heart side) on desktop */}
                <div className="hidden md:flex flex-row gap-3 flex-shrink-0 order-2 xl:order-2 xl:ml-auto">
                    {/* Main image */}
                    <Image
                        src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=85"
                        alt="Friends on a mountain"
                        width={600}
                        height={400}
                        className="w-52 xl:w-64 h-52 xl:h-56 rounded-2xl object-cover shadow-lg"
                    />
                    {/* Two stacked images */}
                    <div className="flex flex-col gap-3">
                        <Image
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80"
                            alt="Mountain lake"
                            width={300}
                            height={200}
                            className="w-32 xl:w-36 h-[96px] xl:h-[104px] rounded-xl object-cover shadow-md"
                        />
                        <Image
                            src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&q=80"
                            alt="Santorini"
                            width={300}
                            height={200}
                            className="w-32 xl:w-36 h-[96px] xl:h-[104px] rounded-xl object-cover shadow-md"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
