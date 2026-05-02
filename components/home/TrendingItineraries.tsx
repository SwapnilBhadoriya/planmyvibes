import Link from "next/link";

type TrendingItem = {
    title: string;
    subtitle: string;
    days: number;
    price: string;
    likes: string;
    gradient: string;
};

const ITEMS: TrendingItem[] = [
    {
        title: "Spiti Valley Roadtrip",
        subtitle: "For the mountain lovers",
        days: 6,
        price: "₹8,500",
        likes: "1.2K",
        gradient: "from-slate-500 to-blue-700",
    },
    {
        title: "Kerala Backwaters",
        subtitle: "Relax, unwind & rejuvenate",
        days: 4,
        price: "₹7,200",
        likes: "982",
        gradient: "from-green-500 to-teal-700",
    },
    {
        title: "Bali Escape",
        subtitle: "Beaches, temples & cafes",
        days: 5,
        price: "₹22,000",
        likes: "1.6K",
        gradient: "from-orange-400 to-pink-600",
    },
];

export default function TrendingItineraries() {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-1.5">
                    🔥 Trending Itineraries
                </h2>
                <Link href="/itineraries" className="text-xs text-purple-600 font-medium hover:underline">
                    View all →
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {ITEMS.map((item) => (
                    <div key={item.title} className="flex items-center gap-3 cursor-pointer group">
                        {/* Thumbnail */}
                        <div className={`h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${item.gradient}`} />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                            <p className="text-xs text-gray-600 mt-0.5">
                                {item.days} Days · {item.price}
                            </p>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-1 shrink-0">
                            <span className="text-red-500 text-xs">♥</span>
                            <span className="text-xs text-gray-500">{item.likes}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
