const STATS = [
    { emoji: "🗺️", number: "500+", label: "Curated Itineraries" },
    { emoji: "📍", number: "100+", label: "Destinations" },
    { emoji: "🥳", number: "50K+", label: "Happy Travelers" },
    { emoji: "📷", number: "10K+", label: "Photos & Experiences" },
    { emoji: "⭐", number: "4.8/5", label: "Trusted by Travelers" },
];

export default function StatsBar() {
    return (
        <div className="bg-white border-y border-gray-100 mx-3 sm:mx-4 xl:mx-6 rounded-2xl mt-4 overflow-hidden">
            <div className="flex flex-wrap xl:flex-nowrap divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                {STATS.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 px-5 py-4 flex-1 min-w-[50%] xl:min-w-0">
                        <span className="text-2xl shrink-0">{s.emoji}</span>
                        <div>
                            <p className="text-xl font-extrabold text-gray-900 leading-none">{s.number}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
