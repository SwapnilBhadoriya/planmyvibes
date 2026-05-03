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

                <div className=" px-10 grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-6 items-start relative z-10 -mt-8">

                    {/* Main content */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mt-8">
                        <PopularDestinations />
                        <FeatureHighlights />
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-5">
                        <TrendingItineraries />
                        <VibeFinder />
                    </aside>

                </div>
            </main>
        </>
    );
}
