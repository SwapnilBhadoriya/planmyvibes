import DestinationCard, { type DestBadgeColor } from "./DestinationCard";

type Destination = {
    badge: string;
    badgeColor: DestBadgeColor;
    location: string;
    country: string;
    description: string;
    days: number;
    price: string;
    gradient: string;
};

const DESTINATIONS: Destination[] = [
    {
        badge: "Trending",
        badgeColor: "green",
        location: "Bali",
        country: "Indonesia",
        description: "Beaches, temples & endless vibes",
        days: 4,
        price: "₹22,000",
        gradient: "from-emerald-400 via-teal-500 to-cyan-700",
    },
    {
        badge: "Top Rated",
        badgeColor: "blue",
        location: "Swiss Alps",
        country: "Switzerland",
        description: "For the mountain lovers",
        days: 6,
        price: "₹75,000",
        gradient: "from-sky-300 via-blue-500 to-indigo-700",
    },
    {
        badge: "Popular",
        badgeColor: "purple",
        location: "Santorini",
        country: "Greece",
        description: "White houses & blue dreams",
        days: 4,
        price: "₹60,000",
        gradient: "from-blue-400 via-indigo-500 to-purple-700",
    },
    {
        badge: "Hidden Gem",
        badgeColor: "orange",
        location: "Banff",
        country: "Canada",
        description: "Nature at its best",
        days: 5,
        price: "₹80,000",
        gradient: "from-teal-400 via-cyan-500 to-blue-700",
    },
    {
        badge: "Culture",
        badgeColor: "indigo",
        location: "Jaipur",
        country: "India",
        description: "Royal heritage & vibrant culture",
        days: 3,
        price: "₹8,500",
        gradient: "from-orange-400 via-rose-500 to-pink-700",
    },
    {
        badge: "Trending",
        badgeColor: "green",
        location: "Tokyo",
        country: "Japan",
        description: "Neon lights & ancient temples",
        days: 7,
        price: "₹55,000",
        gradient: "from-pink-400 via-fuchsia-500 to-purple-700",
    },
    {
        badge: "Luxury",
        badgeColor: "blue",
        location: "Maldives",
        country: "Indian Ocean",
        description: "Overwater bliss & crystal waters",
        days: 5,
        price: "₹1,20,000",
        gradient: "from-cyan-300 via-blue-400 to-teal-700",
    },
    {
        badge: "Romantic",
        badgeColor: "purple",
        location: "Amalfi Coast",
        country: "Italy",
        description: "Cliffs, colours & la dolce vita",
        days: 6,
        price: "₹68,000",
        gradient: "from-yellow-400 via-orange-500 to-rose-600",
    },
    {
        badge: "Adventure",
        badgeColor: "orange",
        location: "Patagonia",
        country: "Argentina",
        description: "Wild trails & untamed landscapes",
        days: 8,
        price: "₹95,000",
        gradient: "from-slate-400 via-gray-600 to-zinc-800",
    },
    {
        badge: "Culture",
        badgeColor: "indigo",
        location: "Kyoto",
        country: "Japan",
        description: "Temples, geishas & autumn leaves",
        days: 5,
        price: "₹50,000",
        gradient: "from-rose-300 via-pink-400 to-fuchsia-600",
    },
];

export default function PopularDestinationsSection() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    ✨ Destinations
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {DESTINATIONS.map((d) => (
                    <DestinationCard key={d.location} {...d} />
                ))}
            </div>
        </section>
    );
}
