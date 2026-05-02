import Link from "next/link";
import DestinationCard, { type BadgeColor } from "./DestinationCard";

type Destination = {
    badge: string;
    badgeColor: BadgeColor;
    location: string;
    country: string;
    days: number;
    price: string;
    gradient: string;
};

const DESTINATIONS: Destination[] = [
    {
        badge: "Trending",
        badgeColor: "green",
        location: "Goa",
        country: "India",
        days: 3,
        price: "₹4,000",
        gradient: "from-cyan-500 via-teal-600 to-green-800",
    },
    {
        badge: "Popular",
        badgeColor: "blue",
        location: "Manali",
        country: "India",
        days: 4,
        price: "₹6,500",
        gradient: "from-blue-300 via-slate-500 to-slate-800",
    },
    {
        badge: "New",
        badgeColor: "emerald",
        location: "Phuket",
        country: "Thailand",
        days: 5,
        price: "₹18,000",
        gradient: "from-emerald-400 via-teal-500 to-blue-700",
    },
    {
        badge: "Hidden Gem",
        badgeColor: "orange",
        location: "Tawang",
        country: "India",
        days: 4,
        price: "₹7,500",
        gradient: "from-green-600 via-emerald-700 to-slate-800",
    },
    {
        badge: "Top Rated",
        badgeColor: "rose",
        location: "Santorini",
        country: "Greece",
        days: 4,
        price: "₹75,000",
        gradient: "from-blue-400 via-indigo-500 to-purple-700",
    },
];

export default function PopularDestinations() {
    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🚀 Popular Destinations
                </h2>
                <Link href="/destinations" className="text-sm text-purple-600 font-medium hover:underline">
                    View all destinations →
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {DESTINATIONS.map((d) => (
                    <DestinationCard key={d.location} {...d} />
                ))}
            </div>
        </section>
    );
}
