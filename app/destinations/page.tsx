import DestinationsHero from "@/components/destinations/DestinationsHero";
import FilterPanel from "@/components/destinations/FilterPanel";
import PopularDestinationsSection from "@/components/destinations/PopularDestinationsSection";

export default function DestinationsPage() {
    return (
        <main className="overflow-x-hidden">
            <DestinationsHero />

            <div className="mx-4 sm:mx-6 lg:mx-16 rounded-2xl bg-white border border-gray-100 shadow-sm relative z-10 -mt-8 sm:-mt-10 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0 lg:gap-6 items-start">

                {/* FilterPanel — sticky on desktop, collapsible on mobile */}
                <div className="border-b border-gray-100 pb-5 mb-5 lg:border-b-0 lg:pb-0 lg:mb-0 lg:border-r lg:pr-6 lg:sticky lg:top-20 lg:self-start">
                    <FilterPanel />
                </div>

                {/* Right content — scrollable cards area */}
                <div
                    className="overflow-y-auto max-h-[72vh] pr-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-200"
                >
                    <PopularDestinationsSection />
                </div>

            </div>
        </main>
    );
}
