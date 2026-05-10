import DestinationsHero from "@/components/destinations/DestinationsHero";
import FilterPanel from "@/components/destinations/FilterPanel";
import PopularDestinationsSection from "@/components/destinations/PopularDestinationsSection";

export default function DestinationsPage() {
    return (
        <main className="overflow-x-hidden">
            <DestinationsHero />

            <div className="mx-3 sm:mx-4 xl:mx-16 rounded-2xl bg-white border border-gray-100 shadow-sm relative z-10 -mt-6 sm:-mt-8 xl:-mt-10 p-4 sm:p-5 xl:p-8 grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-0 xl:gap-6 items-start mb-8">

                {/* FilterPanel — collapsible on mobile/tablet, sticky sidebar on desktop */}
                <div className="border-b border-gray-100 pb-4 mb-4 xl:border-b-0 xl:pb-0 xl:mb-0 xl:border-r xl:pr-6 xl:sticky xl:top-20 xl:self-start">
                    <FilterPanel />
                </div>

                {/* Destination cards */}
                <div>
                    <PopularDestinationsSection />
                </div>

            </div>
        </main>
    );
}
