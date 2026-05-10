import TopPicksHero from "@/components/top-picks/TopPicksHero";
import TopPicksFilter from "@/components/top-picks/TopPicksFilter";
import TopPicksGrid from "@/components/top-picks/TopPicksGrid";

export const metadata = { title: "Top Picks — TripVibee" };

export default function TopPicksPage() {
    return (
        <main className="overflow-x-hidden">
            <TopPicksHero />

            <div className="mx-3 sm:mx-4 xl:mx-16 rounded-2xl bg-white border border-gray-100 shadow-sm relative z-10 -mt-6 sm:-mt-8 xl:-mt-10 p-4 sm:p-5 xl:p-8 grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-0 xl:gap-6 items-start mb-8">

                {/* Filter sidebar */}
                <div className="border-b border-gray-100 pb-4 mb-4 xl:border-b-0 xl:pb-0 xl:mb-0 xl:border-r xl:pr-6 xl:sticky xl:top-20 xl:self-start">
                    <TopPicksFilter />
                </div>

                {/* Grid */}
                <div>
                    <TopPicksGrid />
                </div>

            </div>
        </main>
    );
}
