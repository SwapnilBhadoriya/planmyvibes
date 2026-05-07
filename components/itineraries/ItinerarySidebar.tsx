import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, StarIcon, Clock01Icon, Backpack01Icon } from "@hugeicons/core-free-icons";

const WHY_ITEMS = [
    {
        icon: GlobeIcon,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        title: "Expert-crafted plans",
        subtitle: "By real travel experts",
    },
    {
        icon: StarIcon,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Best price guarantee",
        subtitle: "Always the best deal",
    },
    {
        icon: Clock01Icon,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        title: "24/7 Support",
        subtitle: "We're here anytime",
    },
    {
        icon: Backpack01Icon,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        title: "Safe & secure",
        subtitle: "Your safety first",
    },
];

export default function ItinerarySidebar() {
    return (
        <div className="flex flex-col gap-4">

            {/* Find My Itinerary */}
            <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 p-5">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/10" />

                <span className="text-2xl">🗺️</span>

                <h2 className="font-bold text-white text-[15px] mt-2 leading-snug">
                    Not sure which itinerary?
                </h2>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                    Answer a few quick questions — we&apos;ll find the perfect trip for you.
                </p>

                <button className="mt-4 w-full bg-white hover:bg-gray-50 text-purple-700 text-xs font-bold rounded-full py-2.5 transition-colors shadow-md">
                    Find My Itinerary →
                </button>
            </section>

            {/* Why Book With Us */}
            <section className="rounded-2xl bg-white border border-gray-200 p-4">
                <h2 className="font-bold text-gray-900 text-sm mb-3">Why book with us?</h2>
                <div className="flex flex-col gap-3">
                    {WHY_ITEMS.map((item) => (
                        <div key={item.title} className="flex items-center gap-3">
                            <span className={`shrink-0 ${item.iconBg} rounded-xl p-2`}>
                                <HugeiconsIcon icon={item.icon} size={14} strokeWidth={1.8} className={item.iconColor} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                                <p className="text-[11px] text-gray-400 truncate">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
