const FEATURES = [
    {
        emoji: "😎",
        title: "Vibe Based Trips",
        subtitle: "Find trips that match your mood and energy.",
    },
    {
        emoji: "🗺️",
        title: "Smart Planning",
        subtitle: "Day-wise plans, budgets, tips and more.",
    },
    {
        emoji: "💬",
        title: "Real & Honest",
        subtitle: "No filter reviews and real traveler experiences.",
    },
    {
        emoji: "🎒",
        title: "Travel Better",
        subtitle: "Essential info to help you travel stress-free.",
    },
];

export default function FeatureHighlights() {
    return (
        <section className="mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {FEATURES.map((f) => (
                    <div
                        key={f.title}
                        className="flex flex-col gap-2 rounded-2xl bg-purple-50 p-5 hover:bg-purple-100 transition-colors cursor-default"
                    >
                        <span className="text-3xl">{f.emoji}</span>
                        <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{f.subtitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
