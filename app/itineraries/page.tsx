import ItinerariesHero from "@/components/itineraries/ItinerariesHero";
import ItineraryFilterPanel from "@/components/itineraries/ItineraryFilterPanel";
import ItinerariesGrid from "@/components/itineraries/ItinerariesGrid";
import ItinerarySidebar from "@/components/itineraries/ItinerarySidebar";

export default function ItinerariesPage() {
    return (
        <main className="overflow-x-hidden">
            <ItinerariesHero />

            <div className="mx-4 sm:mx-6 lg:mx-16 rounded-2xl bg-white border border-gray-100 shadow-sm relative z-10 -mt-8 sm:-mt-10 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-0 lg:gap-6 items-start mb-8">

                {/* Left filter — sticky on desktop, collapsible on mobile */}
                <div className="border-b border-gray-100 pb-5 mb-5 lg:border-b-0 lg:pb-0 lg:mb-0 lg:border-r lg:pr-6 lg:sticky lg:top-20 lg:self-start">
                    <ItineraryFilterPanel />
                </div>

                {/* Main content */}
                <div>
                    <ItinerariesGrid />
                </div>

                {/* Right sidebar — sticky on desktop */}
                <div className="border-t border-gray-100 pt-5 mt-5 lg:border-t-0 lg:pt-0 lg:mt-0 lg:border-l lg:pl-6 lg:sticky lg:top-20 lg:self-start">
                    <ItinerarySidebar />
                </div>

            </div>
        </main>
    );
}
