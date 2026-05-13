import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import TrendingItineraries from "@/components/home/TrendingItineraries";
import VibeFinder from "@/components/home/VibeFinder";

export default function HomePage() {
    return (
        <>
            <main>
                <HeroSection />

                <div className="px-3 sm:px-5 xl:px-10 grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-4 xl:gap-6 items-start relative z-10 -mt-4 xl:-mt-8">

                    {/* Main content */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm mt-4 xl:mt-8">
                        <PopularDestinations />
                        <FeatureHighlights />
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-4 xl:gap-5">
                        <TrendingItineraries />
                        <VibeFinder />
                    </aside>

                </div>
            </main>
        </>
    );
}
